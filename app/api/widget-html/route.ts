import { NextResponse } from "next/server";
import { generateStaticHtml } from "@/lib/staticGenerator";
import { fetchLatestYouTube, fetchLiveShipping } from "@/lib/fetchers/mediaCrawler";
import { fetchRecommendedPCs } from "@/lib/fetchers/yjmodCrawler";

export const revalidate = 21600; // 6 hours cache

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cpu = searchParams.get('cpu') || undefined;
    const gpu = searchParams.get('gpu') || undefined;
    const priceStr = searchParams.get('price');
    const price = priceStr ? parseInt(priceStr, 10) : undefined;

    // 비동기로 위젯에 필요한 주변 데이터 가져오기
    const [ytVideo, cafePosts, recommendedPcs] = await Promise.all([
        fetchLatestYouTube().catch(() => null),
        fetchLiveShipping().catch(() => []),
        fetchRecommendedPCs().catch(() => [])
    ]);

    // 인라인 CSS가 적용된 순수 HTML 스트링 생성
    const html = generateStaticHtml({
        quoteCpu: cpu,
        quoteGpu: gpu,
        quotePrice: price,
        ytVideo: null, // 테스트를 위해 네이버 카페/유튜브 임시 비활성화
        cafePosts: [], // 테스트를 위해 네이버 카페/유튜브 임시 비활성화
        recommendedPcs: recommendedPcs.slice(0, 2) // 상위 2개만 노출
    });

    // 자사몰(PHP) 및 타 도메인에서 호출할 수 있도록 CORS 헤더 추가 반환
    return new NextResponse(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
