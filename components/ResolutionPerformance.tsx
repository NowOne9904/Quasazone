import { Monitor } from "lucide-react";

const RESOLUTIONS = [
    {
        label: "FHD",
        sub: "1920×1080",
        color: "text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/5",
        games: [
            { name: "발로란트",            fps: "240+",  opt: "최고" },
            { name: "APEX 레전드",         fps: "144+",  opt: "최고" },
            { name: "리그 오브 레전드",    fps: "144+",  opt: "최고" },
            { name: "GTA V",               fps: "144+",  opt: "최고" },
            { name: "배틀그라운드",        fps: "144+",  opt: "최고" },
            { name: "FC 25",               fps: "60+",   opt: "최고" },
        ],
        recommend: "RTX 5060 이상",
    },
    {
        label: "QHD",
        sub: "2560×1440",
        color: "text-blue-400",
        border: "border-blue-500/20",
        bg: "bg-blue-500/5",
        games: [
            { name: "발로란트",            fps: "240+",  opt: "최고" },
            { name: "APEX 레전드",         fps: "144+",  opt: "최고" },
            { name: "리그 오브 레전드",    fps: "144+",  opt: "최고" },
            { name: "GTA V",               fps: "144+",  opt: "최고" },
            { name: "배틀그라운드",        fps: "100+",  opt: "최고" },
            { name: "사이버펑크 2077",     fps: "60+",   opt: "최고" },
        ],
        recommend: "RTX 5070 이상",
    },
    {
        label: "4K",
        sub: "3840×2160",
        color: "text-purple-400",
        border: "border-purple-500/20",
        bg: "bg-purple-500/5",
        games: [
            { name: "발로란트",            fps: "144+",  opt: "최고" },
            { name: "APEX 레전드",         fps: "100+",  opt: "최고" },
            { name: "GTA V",               fps: "100+",  opt: "최고" },
            { name: "배틀그라운드",        fps: "60+",   opt: "최고" },
            { name: "사이버펑크 2077",     fps: "60+",   opt: "레이트레이싱" },
            { name: "엘든 링",             fps: "60+",   opt: "최고" },
        ],
        recommend: "RTX 5080 이상",
    },
];

export default function ResolutionPerformance() {
    return (
        <section className="space-y-3">
            <div className="flex items-center space-x-2 px-1">
                <Monitor className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-zinc-100 tracking-tight">해상도별 게이밍 성능</h2>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
                {RESOLUTIONS.map((res) => (
                    <div key={res.label} className={`rounded-xl border ${res.border} ${res.bg} overflow-hidden`}>
                        {/* 해상도 헤더 */}
                        <div className={`px-3 py-2 border-b ${res.border}`}>
                            <p className={`font-extrabold text-sm ${res.color}`}>{res.label}</p>
                            <p className="text-[9px] text-zinc-500 font-mono">{res.sub}</p>
                        </div>

                        {/* 게임 목록 */}
                        <div className="px-2.5 py-2 space-y-1.5">
                            {res.games.map((g) => (
                                <div key={g.name} className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] text-zinc-400 truncate leading-tight">{g.name}</span>
                                    <span className={`text-[10px] font-bold ${res.color} shrink-0`}>{g.fps}</span>
                                </div>
                            ))}
                        </div>

                        {/* 추천 GPU */}
                        <div className={`px-2.5 py-1.5 border-t ${res.border}`}>
                            <p className="text-[9px] text-zinc-500 leading-tight">{res.recommend}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
