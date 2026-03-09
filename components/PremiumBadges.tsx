import { ShieldCheck, Truck, Wrench, Headphones } from "lucide-react";

export default function PremiumBadges() {
    const badges = [
        { icon: ShieldCheck, title: "100% 정품", desc: "공식 유통사 인증", color: "text-blue-400", bg: "bg-blue-500/10" },
        { icon: Truck, title: "프리미엄 특송", desc: "발렉스 안전배송", color: "text-purple-400", bg: "bg-purple-500/10" },
        { icon: Wrench, title: "완벽 선정리", desc: "장인정신 조립", color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { icon: Headphones, title: "평생 A/S", desc: "신속 사후관리", color: "text-amber-400", bg: "bg-amber-500/10" },
    ];

    return (
        <section className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 mt-2 mb-2">
            <h2 className="sr-only">프리미엄 서비스</h2>
            <div className="grid grid-cols-4 gap-2">
                {badges.map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-2 text-center group cursor-default">
                        <div className={`w-10 h-10 rounded-xl ${badge.bg} flex items-center justify-center mb-2 transition-transform duration-300 group-hover:-translate-y-0.5`}>
                            <badge.icon className={`w-5 h-5 ${badge.color}`} />
                        </div>
                        <h3 className="font-bold text-zinc-200 text-[11px] mb-0.5 tracking-tight">{badge.title}</h3>
                        <p className="text-[9px] text-zinc-500 font-medium">{badge.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
