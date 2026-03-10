import SmartSuggestTier from "@/components/SmartSuggestTier";
import ResolutionPerformance from "@/components/ResolutionPerformance";
import { YouTubeReviewWidget, LiveShippingWidget } from "@/components/MediaWidgets";
import RecommendedPCs from "@/components/RecommendedPCs";
import PremiumBadges from "@/components/PremiumBadges";

// Server Component - 최소 갱신 주기: Naver Cafe 3시간, YouTube/PC 6시간
export const revalidate = 10800; // 3시간 (최소 주기 기준)

export default async function WidgetPage({
    searchParams,
}: {
    searchParams: Promise<{ price?: string; gpu?: string }>;
}) {
    const params = await searchParams;
    const quotePrice = params.price ? parseInt(params.price, 10) : undefined;
    const quoteGpu = params.gpu ?? undefined;

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
                <ResolutionPerformance gpu={quoteGpu} />

                {/* 2. Smart Suggest Tier Section (Personalized Recommendation) */}
                <SmartSuggestTier quotePrice={quotePrice} quoteGpu={quoteGpu} />

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
