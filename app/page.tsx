import QuotePlaceholder from "@/components/QuotePlaceholder";
import SmartSuggestTier from "@/components/SmartSuggestTier";
import RecommendedPCs from "@/components/RecommendedPCs";
import MediaWidgets from "@/components/MediaWidgets";
import PremiumBadges from "@/components/PremiumBadges";

// Server Component - This page will be statically generated and revalidated every 6 hours
export const revalidate = 21600; // 6 hours

export default async function WidgetPage() {
    return (
        <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50 flex justify-center selection:bg-indigo-100 selection:text-indigo-900">
            <div className="w-full max-w-5xl space-y-8">
                {/* Header / Intro */}
                <header className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">영재컴퓨터 맞춤형 견적 솔루션</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">전문가가 제안하는 당신을 위한 최적의 시스템</p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
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
