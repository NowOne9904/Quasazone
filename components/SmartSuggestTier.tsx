import { ArrowUpRight, ArrowRight, ArrowDownRight, Zap, Link2 } from "lucide-react";
import { fetchRecommendedPCs, RecommendedPC } from "@/lib/fetchers/yjmodCrawler";

interface Props {
    quotePrice?: number;
}

const parsePrice = (p: string) => parseInt(p.replace(/,/g, ""), 10) || 0;

const TIER_STYLES = [
    { label: "상위 제안", Icon: ArrowUpRight, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "유사 가격대", Icon: ArrowRight,    bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20"   },
    { label: "가성비 선택", Icon: ArrowDownRight, bg: "bg-rose-500/10",   text: "text-rose-400",   border: "border-rose-500/20"   },
];

export default async function SmartSuggestTier({ quotePrice }: Props) {
    const pcs = await fetchRecommendedPCs();

    // 가격 파라미터 없을 때 - 연동 대기 안내
    if (!quotePrice || pcs.length === 0) {
        return (
            <section className="space-y-3">
                <div className="flex items-center space-x-2 px-1">
                    <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                    <h2 className="text-sm font-bold text-zinc-100 tracking-tight">스마트 견적 제안</h2>
                </div>
                <div className="flex items-center justify-center gap-2 py-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 text-zinc-500">
                    <Link2 className="w-4 h-4" />
                    <p className="text-xs">견적 연동 시 맞춤 상위·동급·하위 PC를 자동 추천합니다</p>
                </div>
            </section>
        );
    }

    // 가격 오름차순 정렬
    const sorted = [...pcs].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));

    // 견적 가격 기준으로 가장 가까운 인덱스 찾기
    let idx = sorted.findIndex(pc => parsePrice(pc.price) >= quotePrice);
    if (idx === -1) idx = sorted.length - 1; // 모든 PC보다 비싸면 최상위

    // 3개 카드 인덱스 결정 (항상 3개 유지)
    let indices: number[];
    if (sorted.length <= 3) {
        indices = sorted.map((_, i) => i);
    } else if (idx === 0) {
        indices = [2, 1, 0]; // 가장 저렴한 견적 → 위 2개 + 현재
    } else if (idx >= sorted.length - 1) {
        indices = [sorted.length - 1, sorted.length - 2, sorted.length - 3]; // 최상위 견적
    } else {
        indices = [idx + 1, idx, idx - 1]; // 상위 / 현재 / 하위
    }

    const cards = indices.map((pcIdx, slotIdx) => ({
        pc: sorted[pcIdx],
        style: TIER_STYLES[slotIdx],
        diff: parsePrice(sorted[pcIdx].price) - quotePrice,
    }));

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                    <h2 className="text-sm font-bold text-zinc-100 tracking-tight">스마트 견적 제안</h2>
                </div>
                <span className="text-[10px] text-zinc-500">
                    견적 {quotePrice.toLocaleString()}원 기준
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
                {cards.map(({ pc, style, diff }) => {
                    const diffLabel = diff > 0
                        ? `+${Math.round(diff / 10000)}만원`
                        : diff < 0
                        ? `${Math.round(diff / 10000)}만원`
                        : "동급";
                    const tabShort = pc.tabName
                        .replace(" MD 추천 PC", "")
                        .replace(" MD 추천PC", "");

                    return (
                        <a
                            key={pc.id}
                            href={pc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative overflow-hidden rounded-xl p-3 border ${style.border} ${style.bg} hover:border-opacity-60 transition-all duration-300 block`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${style.bg} ${style.text}`}>
                                    {style.label}
                                </span>
                                <div className={`p-1 rounded-lg ${style.bg} ${style.text}`}>
                                    <style.Icon className="w-3 h-3" />
                                </div>
                            </div>
                            <h3 className={`font-bold text-xs ${style.text} tracking-tight leading-tight`}>
                                {tabShort}
                            </h3>
                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{pc.name}</p>
                            <div className="mt-2 pt-2 border-t border-white/5">
                                <p className={`font-bold text-[11px] ${style.text}`}>{diffLabel}</p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
