import { ArrowUpRight, ArrowRight, ArrowDownRight, Cpu, Zap } from "lucide-react";

const suggestions = [
    {
        tier: "상위 제안",
        title: "하이엔드 퍼포먼스",
        desc: "RTX 4080S / R7 7800X3D",
        diff: "+ 450,000원",
        icon: ArrowUpRight,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
    },
    {
        tier: "동급 대안",
        title: "인텔 최적화 구성",
        desc: "RTX 4070 TiS / i7-14700K",
        diff: "비슷한 가격대",
        icon: ArrowRight,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
    },
    {
        tier: "가성비 하위",
        title: "스마트 밸런스",
        desc: "RTX 4070S / R5 7600",
        diff: "- 320,000원",
        icon: ArrowDownRight,
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/20",
    },
];

export default function SmartSuggestTier() {
    return (
        <section className="space-y-3">
            <div className="flex items-center space-x-2 px-1">
                <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                <h2 className="text-sm font-bold text-zinc-100 tracking-tight">스마트 견적 제안</h2>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
                {suggestions.map((item, idx) => (
                    <div
                        key={idx}
                        className={`cursor-pointer group relative overflow-hidden rounded-xl p-3 border ${item.border} ${item.bg} backdrop-blur-sm hover:border-opacity-60 transition-all duration-300`}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${item.bg} ${item.text}`}>
                                    {item.tier}
                                </span>
                                <div className={`p-1 rounded-lg ${item.bg} ${item.text}`}>
                                    <item.icon className="w-3 h-3" />
                                </div>
                            </div>
                            <h3 className="font-bold text-xs text-zinc-100 group-hover:text-white transition-colors tracking-tight leading-tight">{item.title}</h3>
                            <p className="text-[10px] text-zinc-500 mt-1 flex items-center truncate">
                                <Cpu className="w-2.5 h-2.5 mr-0.5 inline-block opacity-70 shrink-0" />
                                {item.desc}
                            </p>
                            <div className="mt-2 pt-2 border-t border-white/5">
                                <p className={`font-bold text-[11px] ${item.text}`}>{item.diff}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
