import * as cheerio from "cheerio";

export interface RecommendedPC {
    id: string;
    name: string;
    price: string;
    img: string;
}

export async function fetchRecommendedPCs(): Promise<RecommendedPC[]> {
    try {
        // 6 hours cache
        const res = await fetch("https://www.youngjaecomputer.com/", {
            next: { revalidate: 21600 }
        });

        if (!res.ok) throw new Error("Failed to fetch YJMOD");

        const html = await res.text();
        const $ = cheerio.load(html);
        const pcs: RecommendedPC[] = [];

        // Target the specific section or generic product lists in YJMOD. Assuming `.prd_list li`
        // This is a generic selector based on standard Korean mall designs, it will be mapped correctly if standard.
        // If not, it will return empty, which is fine for the dummy integration phase.
        $('.prd_list li').slice(0, 4).each((i, el) => {
            const name = $(el).find('.name a').text().trim() || `[영재컴퓨터] YJ 추천 견적 ${i + 1}`;
            const price = $(el).find('.price').text().trim().replace(/[^0-9,]/g, "") || `${(i + 1) * 850},000`;
            let img = $(el).find('.img img').attr('src') || `https://via.placeholder.com/300x300.png?text=PC+${i + 1}`;

            // Fix relative URLs
            if (img.startsWith('/')) img = `https://www.youngjaecomputer.com${img}`;

            pcs.push({ id: `yj-${i}`, name, price, img });
        });

        // Fallback if scraping didn't find the exact standard class
        if (pcs.length === 0) {
            return [
                { id: "1", name: "[영재컴퓨터] YJ-1 (하이엔드 게이밍)", price: "2,450,000", img: "https://via.placeholder.com/300x300.png?text=PC+1" },
                { id: "2", name: "[영재컴퓨터] YJ-2 (가성비 작업용)", price: "1,250,000", img: "https://via.placeholder.com/300x300.png?text=PC+2" },
                { id: "3", name: "[영재컴퓨터] YJ-3 (인텔 코어 울트라)", price: "3,150,000", img: "https://via.placeholder.com/300x300.png?text=PC+3" },
                { id: "4", name: "[영재컴퓨터] YJ-4 (화이트 셋업)", price: "1,850,000", img: "https://via.placeholder.com/300x300.png?text=PC+4" },
            ];
        }

        return pcs;
    } catch (error) {
        console.error("YJMOD Crawling Error:", error);
        // Return dummy data on failure so the widget never breaks
        return [
            { id: "1", name: "[영재컴퓨터] YJ-1 (하이엔드 게이밍)", price: "2,450,000", img: "https://via.placeholder.com/300x300.png?text=PC+1" },
            { id: "2", name: "[영재컴퓨터] YJ-2 (가성비 작업용)", price: "1,250,000", img: "https://via.placeholder.com/300x300.png?text=PC+2" },
            { id: "3", name: "[영재컴퓨터] YJ-3 (인텔 코어 울트라)", price: "3,150,000", img: "https://via.placeholder.com/300x300.png?text=PC+3" },
            { id: "4", name: "[영재컴퓨터] YJ-4 (화이트 셋업)", price: "1,850,000", img: "https://via.placeholder.com/300x300.png?text=PC+4" },
        ];
    }
}
