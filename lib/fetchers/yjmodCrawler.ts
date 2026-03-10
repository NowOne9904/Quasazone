import * as cheerio from "cheerio";

export interface RecommendedPC {
    id: string;
    tabName: string;
    name: string;
    price: string;
    link: string;
    img: string;
}

export async function fetchRecommendedPCs(): Promise<RecommendedPC[]> {
    try {
        const res = await fetch("https://www.youngjaecomputer.com/", {
            next: { revalidate: 21600 },
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });

        if (!res.ok) throw new Error("Failed to fetch YJMOD");

        const html = await res.text();
        const $ = cheerio.load(html);

        // 탭 이름 추출 (100만원대 MD 추천 PC, 500만원대 등)
        const tabLabels: string[] = [];
        $('#idx_t2_menu_table .idx_t2_menu').each((_, el) => {
            tabLabels.push($(el).text().trim());
        });

        const pcs: RecommendedPC[] = [];

        $('.utube_tr2').each((i, row) => {
            // YouTube iframe src에서 videoId 추출 → 썸네일 이미지
            const iframeSrc = $(row).find('iframe.youtube_iframe2').attr('src') ?? '';
            const videoIdMatch = iframeSrc.match(/embed\/([a-zA-Z0-9_-]+)/);
            const videoId = videoIdMatch?.[1] ?? '';
            const img = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

            // 상품명 + 구매 링크
            const anchor = $(row).find('a[href*="item.php"]').first();
            const link = anchor.attr('href') ?? 'https://www.youngjaecomputer.com/';
            const name = anchor.text().trim();

            // 혜택가: td[align=right] 내 두 번째 .bold div (빨간색 = 할인가)
            const priceDivs = $(row).find('td[align=right] div.bold');
            const price = $(priceDivs[1]).text().trim().replace('원', '').trim();

            const tabName = tabLabels[i] ?? `추천 PC ${i + 1}`;

            if (name) {
                pcs.push({ id: `yj-${i}`, tabName, name, price, link, img });
            }
        });

        if (pcs.length > 0) return pcs;
        throw new Error("No PCs parsed");

    } catch (error) {
        console.error("YJMOD Crawling Error:", error);
        return [
            { id: "1", tabName: "100만원대 MD 추천 PC", name: "2026년 가장 합리적인 표준 게이밍PC", price: "1,794,400", link: "https://www.youngjaecomputer.com/shop/item.php?it_id=2766557290", img: "https://img.youtube.com/vi/jbWiVEnZXrg/hqdefault.jpg" },
            { id: "2", tabName: "500만원대 MD 추천PC", name: "9800X3D의 강력함! QHD 최상의 게이밍성능", price: "4,822,540", link: "https://www.youngjaecomputer.com/shop/item.php?it_id=2766559351", img: "https://img.youtube.com/vi/6KvCSDDaarQ/hqdefault.jpg" },
            { id: "3", tabName: "300만원대 MD 추천PC", name: "게임부터 스트리밍, 작업까지! 고성능 게이밍 PC", price: "3,274,330", link: "https://www.youngjaecomputer.com/shop/item.php?it_id=2770022087", img: "https://img.youtube.com/vi/vPH2rAgEiFE/hqdefault.jpg" },
            { id: "4", tabName: "400만원대 MD 추천PC", name: "타협 따위는 없다! 현존 최강 하이엔드 PC!", price: "4,366,640", link: "https://www.youngjaecomputer.com/shop/item.php?it_id=2770023641", img: "https://img.youtube.com/vi/EYN20OhHeJ4/hqdefault.jpg" },
        ];
    }
}
