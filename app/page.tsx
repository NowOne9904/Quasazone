import SmartSuggestTier from "@/components/SmartSuggestTier";
import ResolutionPerformance from "@/components/ResolutionPerformance";
import { YouTubeReviewWidget, LiveShippingWidget } from "@/components/MediaWidgets";
import RecommendedPCs from "@/components/RecommendedPCs";
import PremiumBadges from "@/components/PremiumBadges";

// Server Component - 테스트를 위해 상시 갱신(1초)으로 임시 변경
export const revalidate = 1;

export default async function WidgetPage({
    searchParams,
}: {
    searchParams: Promise<{ price?: string; gpu?: string; cpu?: string }>;
}) {
    const params = await searchParams;

    // 테스트 및 미리보기를 위해 파라미터가 없을 경우 기본값(Sellpro 예시) 적용
    const quotePrice = params.price ? parseInt(params.price, 10) : 1313650;
    const quoteGpu = params.gpu ?? "ASRock 라데온 RX 9060 XT 스틸레전드 OC D6 8GB 대원씨티에스";
    const quoteCpu = params.cpu ?? "AMD 라이젠5-5세대 7500F (라파엘)";

    return (
        // Hard constraint to 647px max width, centered.
        <main className="w-full max-w-[647px] mx-auto min-h-screen p-4 bg-[#1a1a1a] rounded-lg shadow-2xl border border-zinc-800 selection:bg-indigo-500/30 selection:text-indigo-200">
            <div className="w-full space-y-6">
                {/* Header / Intro */}
                <header className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-sm inline-block"></span>
                            맞춤형 견적 솔루션
                        </h1>
                        <p className="text-[11px] font-medium text-zinc-400 mt-1 pl-4">영재컴퓨터가 제안하는 완벽한 시스템</p>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span>Static Cached (6h)</span>
                    </div>
                </header>

                {/* 1. Resolution Performance Guide (Technical Reference - Top Priority) */}
                <ResolutionPerformance gpu={quoteGpu} cpu={quoteCpu} />

                {/* 2. Smart Suggest Tier Section (Personalized Recommendation) */}
                <SmartSuggestTier quotePrice={quotePrice} quoteGpu={quoteGpu} quoteCpu={quoteCpu} />

                {/* 3. Live Shipping Widget (Social Proof - Cafe) */}
                <LiveShippingWidget />

                {/* 4. YouTube Review Widget (Social Proof - YouTube) */}
                <YouTubeReviewWidget />

                {/* 5. Recommended PCs Section (Product Suggestions) */}
                <RecommendedPCs />

                {/* 6. Premium Services Badges (Trust) */}
                <PremiumBadges />

            </div>
        </main>
    );
}
