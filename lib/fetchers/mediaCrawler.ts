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

// 채널 ID: YJMOD x 영재컴퓨터
const YT_CHANNEL_ID = "UCaOwfLJxMjZ8RCBwg8_c90A";

export async function fetchLatestYouTube(): Promise<YouTubeVideo> {
    try {
        const res = await fetch(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
            { next: { revalidate: 21600 } } // 6시간
        );

        if (!res.ok) throw new Error(`YouTube RSS failed: ${res.status}`);

        const xml = await res.text();
        const $ = cheerio.load(xml, { xmlMode: true });

        let result: YouTubeVideo | null = null;

        $("entry").each((_, el) => {
            if (result) return false;

            const link = $(el).find("link").attr("href") || "";
            // 쇼츠 제외
            if (link.includes("/shorts/")) return;

            const title = $(el).find("title").first().text().trim();
            const videoId = $(el).find("yt\\:videoId, videoId").text().trim();
            const thumbnail = $(el).find("media\\:thumbnail, thumbnail").attr("url")
                || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            const published = $(el).find("published").text().trim();

            result = {
                title,
                thumbnail,
                publishedStr: published ? formatRelativeTime(published) : "최근 업로드됨",
                url: link,
            };
        });

        if (result) return result;
        throw new Error("No non-shorts video found");

    } catch (error) {
        console.error("YouTube RSS Error:", error);
        return {
            title: "대충사면 '절대' 안됩니다. 이 영상 '반드시' 보고 사세요.",
            thumbnail: "https://i.ytimg.com/vi/z0h5U2GWWy8/hqdefault.jpg",
            publishedStr: "최근 업로드됨",
            url: `https://www.youtube.com/watch?v=z0h5U2GWWy8`,
        };
    }
}

function formatRelativeTime(isoString: string): string {
    try {
        const diff = Date.now() - new Date(isoString).getTime();
        const hours = Math.floor(diff / 3_600_000);
        if (hours < 1) return "방금 전";
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}일 전`;
        return `${Math.floor(days / 7)}주 전`;
    } catch {
        return "최근 업로드됨";
    }
}
