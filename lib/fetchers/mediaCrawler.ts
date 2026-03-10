import * as cheerio from "cheerio";

export interface CafePost {
    id: string;
    title: string;
    time: string;
    link: string;
    img: string;
}

export interface YouTubeVideo {
    title: string;
    thumbnail: string;
    publishedStr: string;
    url: string;
}

export async function fetchLiveShipping(): Promise<CafePost[]> {
    // 3시간 캐시
    const revalidate = 10800;

    try {
        // 새 Naver Cafe URL (사진 보기 모드)
        const res = await fetch(
            "https://cafe.naver.com/ArticleList.nhn?search.clubid=31248285&search.menuid=1&search.boardtype=I",
            {
                next: { revalidate },
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "https://cafe.naver.com/"
                }
            }
        );

        if (!res.ok) throw new Error("Naver Cafe blocked");

        const html = await res.text();
        const $ = cheerio.load(html);
        const posts: CafePost[] = [];

        // 사진 게시판 셀렉터 (Naver Cafe 이미지 목록)
        $('.article-board li').slice(0, 6).each((i, el) => {
            const anchor = $(el).find('a.article').first();
            const title = anchor.find('.aaa').text().trim() || anchor.text().trim();
            const href = anchor.attr('href') ?? '';
            const articleIdMatch = href.match(/ArticleRead\.nhn.*articleid=(\d+)/) ||
                                   href.match(/articles\/(\d+)/);
            const articleId = articleIdMatch?.[1] ?? '';
            const link = articleId
                ? `https://cafe.naver.com/f-e/cafes/31248285/articles/${articleId}`
                : 'https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I';

            const img = $(el).find('img').first().attr('src') ?? '';
            const time = $(el).find('.td_date').text().trim() || '';

            if (title) {
                posts.push({ id: `cafe-${i}`, title, time, link, img });
            }
        });

        if (posts.length > 0) return posts;
        throw new Error("No posts found");

    } catch {
        return fallbackPosts;
    }
}

const fallbackPosts: CafePost[] = [
    {
        id: "1",
        title: "김*진 고객님 RTX 5080 하이엔드 조립 완료",
        time: "오늘 16:45",
        link: "https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I",
        img: "https://img.youtube.com/vi/jbWiVEnZXrg/mqdefault.jpg"
    },
    {
        id: "2",
        title: "박*수 고객님 9800X3D 게이밍 PC 출고",
        time: "오늘 15:20",
        link: "https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I",
        img: "https://img.youtube.com/vi/6KvCSDDaarQ/mqdefault.jpg"
    },
    {
        id: "3",
        title: "이*영 고객님 딥러닝 워크스테이션 조립",
        time: "오늘 14:10",
        link: "https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I",
        img: "https://img.youtube.com/vi/vPH2rAgEiFE/mqdefault.jpg"
    },
    {
        id: "4",
        title: "정*민 고객님 가성비 게이밍 PC 완료",
        time: "오늘 12:30",
        link: "https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I",
        img: "https://img.youtube.com/vi/jbWiVEnZXrg/mqdefault.jpg"
    },
    {
        id: "5",
        title: "최*호 고객님 화이트 풀셋업 조립 완료",
        time: "오늘 11:05",
        link: "https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I",
        img: "https://img.youtube.com/vi/6KvCSDDaarQ/mqdefault.jpg"
    },
    {
        id: "6",
        title: "오*진 고객님 RTX 5060 표준 게이밍 출고",
        time: "오늘 09:50",
        link: "https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I",
        img: "https://img.youtube.com/vi/vPH2rAgEiFE/mqdefault.jpg"
    },
];

export async function fetchLatestYouTube(): Promise<YouTubeVideo> {
    try {
        const rssUrl = encodeURIComponent(
            "https://www.youtube.com/feeds/videos.xml?channel_id=UCT-Oib2FDEcEhe8UInb0Yqw"
        );
        const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`,
            { next: { revalidate: 21600 } }
        );

        if (!res.ok) throw new Error("YouTube RSS failed");

        const data = await res.json();
        // Shorts 제외: 제목에 #shorts 없고 링크에 /shorts/ 없는 것
        const video = data.items?.find((item: { title: string; link?: string }) =>
            !item.title.toLowerCase().includes('#shorts') &&
            !item.link?.includes('/shorts/')
        );

        if (video) {
            return {
                title: video.title,
                thumbnail: video.thumbnail,
                publishedStr: "최근 업로드됨",
                url: video.link
            };
        }
        throw new Error("No non-shorts video found");
    } catch {
        return {
            title: "RTX 5060 vs RTX 4070 SUPER - 2026 표준 게이밍 비교 리뷰!",
            thumbnail: "https://img.youtube.com/vi/jbWiVEnZXrg/hqdefault.jpg",
            publishedStr: "최근 업로드됨",
            url: "https://www.youtube.com/@%EC%98%81%EC%9E%AC%EC%BB%B4%ED%93%A8%ED%84%B0YJMOD"
        };
    }
}
