import { ShoppingCart, Star } from "lucide-react";
import { fetchRecommendedPCs, RecommendedPC } from "@/lib/fetchers/yjmodCrawler";

export default async function RecommendedPCs() {
    const pcs = await fetchRecommendedPCs();

    return (
        <section className="space-y-4">
            <div className="flex items-center space-x-2 px-2">
                <Star className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">영재컴퓨터 추천 PC</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pcs.map((pc: RecommendedPC) => (
                    <div key={pc.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={pc.img} alt={pc.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between">
                            <h3 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{pc.name}</h3>
                            <div className="mt-3 flex items-end justify-between">
                                <p className="font-extrabold text-indigo-600 tracking-tight">{pc.price}<span className="text-xs font-medium text-gray-500 ml-0.5">원</span></p>
                                <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-indigo-50 flex items-center justify-center transition-colors">
                                    <ShoppingCart className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
