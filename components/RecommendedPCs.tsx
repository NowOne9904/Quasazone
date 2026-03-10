import { ShoppingCart, Star } from "lucide-react";
import { fetchRecommendedPCs, RecommendedPC } from "@/lib/fetchers/yjmodCrawler";

export default async function RecommendedPCs() {
    const pcs = await fetchRecommendedPCs();

    return (
        <section className="space-y-3">
            <div className="flex items-center space-x-2 px-1">
                <Star className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                <h2 className="text-sm font-bold text-zinc-100 tracking-tight">영재컴퓨터 추천 PC</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {pcs.map((pc: RecommendedPC) => (
                    <a
                        key={pc.id}
                        href={pc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
                            {pc.img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={pc.img}
                                    alt={pc.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">이미지 없음</div>
                            )}
                            <span className="absolute top-2 left-2 text-[9px] font-bold bg-indigo-600/90 text-white px-1.5 py-0.5 rounded-full leading-tight">
                                {pc.tabName.replace(" MD 추천 PC", "").replace(" MD 추천PC", "")}
                            </span>
                        </div>
                        <div className="p-3 flex-grow flex flex-col justify-between">
                            <h3 className="font-bold text-xs text-zinc-200 line-clamp-2 leading-tight group-hover:text-white transition-colors">{pc.name}</h3>
                            <div className="mt-2 flex items-end justify-between">
                                <p className="font-extrabold text-sm text-indigo-400 tracking-tight">
                                    {pc.price}
                                    <span className="text-[10px] font-medium text-zinc-500 ml-0.5">원</span>
                                </p>
                                <div className="w-7 h-7 rounded-full bg-zinc-800 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                                    <ShoppingCart className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400" />
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
