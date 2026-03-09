import QuotePlaceholder from "@/components/QuotePlaceholder";
import SmartSuggestTier from "@/components/SmartSuggestTier";
import RecommendedPCs from "@/components/RecommendedPCs";
import MediaWidgets from "@/components/MediaWidgets";
import PremiumBadges from "@/components/PremiumBadges";

// Server Component - This page will be statically generated and revalidated every 6 hours
export const revalidate = 21600; // 6 hours

export default async function WidgetPage() {
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

                {/* 1. Placeholder Section */}
                <QuotePlaceholder />

                {/* 2. Smart Suggest Tier Section */}
                <SmartSuggestTier />

                {/* 3. Recommended PCs Section */}
                <RecommendedPCs />

                {/* 4 & 5. Media Widgets (YouTube / Live Shipping) */}
                <MediaWidgets />

                {/* 6. Premium Services Badges */}
                <PremiumBadges />

            </div>
        </main>
    );
}
