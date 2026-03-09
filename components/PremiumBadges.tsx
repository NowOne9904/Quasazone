import { ShieldCheck, Truck, Wrench, Headphones } from "lucide-react";

export default function PremiumBadges() {
    const badges = [
        { icon: ShieldCheck, title: "100% 정품 보장", desc: "공식 유통사 인증 부품", color: "text-blue-600", bg: "bg-blue-50" },
        { icon: Truck, title: "프리미엄 특송", desc: "안전한 발렉스 배송", color: "text-purple-600", bg: "bg-purple-50" },
        { icon: Wrench, title: "완벽한 선정리", desc: "장인정신 조립 서비스", color: "text-emerald-600", bg: "bg-emerald-50" },
        { icon: Headphones, title: "평생 A/S 케어", desc: "신속하고 정확한 사후관리", color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-8 mb-4">
            <h2 className="sr-only">프리미엄 서비스</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 text-center group cursor-default">
                        <div className={`w-14 h-14 rounded-2xl ${badge.bg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-1`}>
                            <badge.icon className={`w-7 h-7 ${badge.color}`} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1 tracking-tight">{badge.title}</h3>
                        <p className="text-xs text-gray-500 font-medium">{badge.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
