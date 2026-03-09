import { ArrowUpRight, ArrowRight, ArrowDownRight, Cpu, Zap } from "lucide-react";

// Dummy data for visual representation (Actual logic runs at build/ISR time)
const suggestions = [
    {
        tier: "상위 제안",
        title: "하이엔드 퍼포먼스 패키지",
        desc: "RTX 4080 SUPER / Ryzen 7 7800X3D",
        diff: "+ 450,000원",
        icon: ArrowUpRight,
        color: "emerald",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
    },
    {
        tier: "동급 대안",
        title: "인텔 최적화 구성",
        desc: "RTX 4070 Ti SUPER / Core i7-14700K",
        diff: "비슷한 가격대",
        icon: ArrowRight,
        color: "blue",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100",
    },
    {
        tier: "가성비 하위",
        title: "스마트 밸런스 에디션",
        desc: "RTX 4070 SUPER / Ryzen 5 7600",
        diff: "- 320,000원",
        icon: ArrowDownRight,
        color: "rose",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-100",
    },
];

export default function SmartSuggestTier() {
    return (
        <section className="space-y-4">
            <div className="flex items-center space-x-2 px-2">
                <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">스마트 견적 제안</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map((item, idx) => (
                    <div
                        key={idx}
                        className={`cursor-pointer group relative overflow-hidden rounded-3xl p-5 border ${item.border} bg-white shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150`}></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.bg} ${item.text}`}>
                                    {item.tier}
                                </span>
                                <div className={`p-2 rounded-2xl ${item.bg} ${item.text}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1.5 flex items-center truncate">
                                <Cpu className="w-3 h-3 mr-1 inline-block" />
                                {item.desc}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-50/50">
                                <p className={`font-semibold text-sm ${item.text}`}>{item.diff}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
