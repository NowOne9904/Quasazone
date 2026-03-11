import { Monitor, CheckCircle2 } from "lucide-react";
import { lookupGpu, lookupCpu } from "@/lib/gpuTiers";

const RESOLUTIONS = [
    {
        label: "FHD",
        sub: "1920×1080",
        color: "text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/5",
        activeBg: "bg-emerald-500/10",
        activeBorder: "border-emerald-500/50",
        games: [
            { name: "발로란트", fps: "240+", opt: "최고" },
            { name: "APEX 레전드", fps: "144+", opt: "최고" },
            { name: "리그 오브 레전드", fps: "144+", opt: "최고" },
            { name: "GTA V", fps: "144+", opt: "최고" },
            { name: "배틀그라운드", fps: "144+", opt: "최고" },
            { name: "FC 25", fps: "60+", opt: "최고" },
        ],
        recommend: "RTX 5060 이상",
        minTier: 1,
        maxTier: 3,
    },
    {
        label: "QHD",
        sub: "2560×1440",
        color: "text-blue-400",
        border: "border-blue-500/20",
        bg: "bg-blue-500/5",
        activeBg: "bg-blue-500/10",
        activeBorder: "border-blue-500/50",
        games: [
            { name: "발로란트", fps: "240+", opt: "최고" },
            { name: "APEX 레전드", fps: "144+", opt: "최고" },
            { name: "리그 오브 레전드", fps: "144+", opt: "최고" },
            { name: "GTA V", fps: "144+", opt: "최고" },
            { name: "배틀그라운드", fps: "100+", opt: "최고" },
            { name: "사이버펑크 2077", fps: "60+", opt: "최고" },
        ],
        recommend: "RTX 5070 이상",
        minTier: 4,
        maxTier: 5,
    },
    {
        label: "4K",
        sub: "3840×2160",
        color: "text-purple-400",
        border: "border-purple-500/20",
        bg: "bg-purple-500/5",
        activeBg: "bg-purple-500/10",
        activeBorder: "border-purple-500/50",
        games: [
            { name: "발로란트", fps: "144+", opt: "최고" },
            { name: "APEX 레전드", fps: "100+", opt: "최고" },
            { name: "GTA V", fps: "100+", opt: "최고" },
            { name: "배틀그라운드", fps: "60+", opt: "최고" },
            { name: "사이버펑크 2077", fps: "60+", opt: "레이트레이싱" },
            { name: "엘든 링", fps: "60+", opt: "최고" },
        ],
        recommend: "RTX 5080 이상",
        minTier: 6,
        maxTier: 7,
    },
];

export default function ResolutionPerformance({ gpu, cpu }: { gpu?: string, cpu?: string }) {
    const userGpu = gpu ? lookupGpu(gpu) : null;
    const userCpu = cpu ? lookupCpu(cpu) : null;
    const userTier = userGpu?.tier ?? 0;
    const userCpuTier = userCpu?.tier ?? 0;

    // 1. GPU 기반 기본 성능 배율
    let performanceMultiplier = userTier > 0 ? 0.7 + (userTier - 1) * 0.15 : 1;

    // 2. CPU 병목(Bottleneck) 로직 도입
    let bottleneckDiscount = 0;
    if (userTier > 0 && userCpuTier > 0) {
        if (userCpuTier < userTier) {
            const diff = userTier - userCpuTier;
            if (diff === 1) bottleneckDiscount = 0.07;
            else bottleneckDiscount = 0.15;
        }
    }
    performanceMultiplier *= (1 - bottleneckDiscount);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-bold text-zinc-100 tracking-tight">해상도별 게이밍 성능</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    {userCpu && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold border border-zinc-700">
                            {userCpu.label}
                        </span>
                    )}
                    {userGpu && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-extrabold border border-indigo-500/20">
                            {userGpu.config.nvidia?.displayName ?? userGpu.config.amd?.displayName}
                        </span>
                    )}
                    {userGpu && <span className="text-[10px] text-zinc-500 font-medium ml-1">실시간 예상</span>}
                </div>
            </div>

            {!gpu ? (
                /* GPU 미연동 시 안내 플레이스홀더 */
                <div className="relative rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-5 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-zinc-500" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium">
                        견적을 연동하면 선택하신 그래픽카드에 최적화된<br />
                        <span className="text-indigo-400">FHD / QHD / 4K</span> 게임별 예상 프레임을 실시간으로 확인할 수 있습니다.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2.5">
                    {RESOLUTIONS.map((res) => {
                        // 해상도별 기본 감쇠 (QHD: 0.7x, 4K: 0.4x)
                        const resMultiplier = res.label === "QHD" ? 0.7 : res.label === "4K" ? 0.4 : 1.0;
                        const finalMultiplier = performanceMultiplier * resMultiplier;

                        return (
                            <div
                                key={res.label}
                                className={`relative rounded-xl border border-zinc-800 bg-zinc-900/40 transition-all duration-500`}
                            >
                                <div className="absolute top-1 right-1">
                                    <CheckCircle2 className={`w-3 h-3 ${res.color} opacity-40`} />
                                </div>

                                {/* 해상도 헤더 */}
                                <div className={`px-3 py-2 border-b border-zinc-800`}>
                                    <p className={`font-extrabold text-sm ${res.color}`}>{res.label}</p>
                                    <p className="text-[9px] text-zinc-500 font-mono">{res.sub}</p>
                                </div>

                                {/* 게임 목록 (동적 FPS 계산) */}
                                <div className="px-2.5 py-2 space-y-1.5 min-h-[140px]">
                                    {res.games.map((g) => {
                                        const baseFps = parseInt(g.fps.replace("+", ""), 10);
                                        const dynamicFps = Math.round(baseFps * finalMultiplier);
                                        const fpsStr = dynamicFps > 240 ? "240+" : `${dynamicFps}+`;

                                        return (
                                            <div key={g.name} className="flex items-center justify-between gap-1">
                                                <span className="text-[10px] text-zinc-400 truncate leading-tight">{g.name}</span>
                                                <span className={`text-[10px] font-bold ${res.color} shrink-0`}>{fpsStr}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 가이드 */}
                                <div className={`px-2.5 py-1.5 border-t border-zinc-800`}>
                                    <p className="text-[9px] text-zinc-500 leading-tight">예상 평균 프레임 (최고옵션)</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
