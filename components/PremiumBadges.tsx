import { ShieldCheck, Truck, Wrench, Headphones } from "lucide-react";

export default function PremiumBadges() {
    const badges = [
        {
            icon: ShieldCheck,
            title: "100% 정품 부품 사용",
            desc: "영재컴퓨터는 공식 유통사를 통해 인증된 100% 정품 부품만을 사용하여 조립합니다. 부품별 확실한 보증 및 A/S를 제공합니다.",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            icon: Truck,
            title: "프리미엄 특송 안전배송",
            desc: "고가의 조립 PC가 배송 중 파손되지 않도록 일반 택배가 아닌 전문 특송 서비스(발렉스 등)를 통해 가장 안전하게 배송합니다.",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            icon: Wrench,
            title: "장인정신 완벽 선정리",
            desc: "눈에 보이지 않는 내부까지 깔끔하게 정리합니다. 전문가의 꼼꼼한 선정리는 내부 쿨링 효율을 극대화하고 PC 수명을 연장시킵니다.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
        {
            icon: Headphones,
            title: "1년 무상 A/S",
            desc: "영재컴퓨터에서 구매하신 PC는 1년 무상 출장/택배 A/S를 제공합니다. 사용 중 문제가 발생해도 신속하고 전문적인 사후관리를 약속드립니다.",
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        },
    ];

    return (
        <section className="bg-zinc-900/80 rounded-2xl p-5 border border-zinc-800 mt-2 mb-2 flex flex-col gap-3">
            <h2 className="sr-only">프리미엄 서비스</h2>
            {badges.map((badge, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/80 transition-colors group">
                    <div className={`w-14 h-14 shrink-0 rounded-2xl ${badge.bg} flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1`}>
                        <badge.icon className={`w-7 h-7 ${badge.color}`} />
                    </div>
                    <div className="flex flex-col justify-center py-0.5">
                        <h3 className="font-extrabold text-zinc-100 text-[15px] mb-1.5">{badge.title}</h3>
                        <p className="text-[12px] text-zinc-400 leading-relaxed font-medium break-keep pr-2">{badge.desc}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}
