import { Youtube, Play, BellRing, Clock } from "lucide-react";
import { fetchLatestYouTube, fetchLiveShipping, YouTubeVideo, CafePost } from "@/lib/fetchers/mediaCrawler";

export default async function MediaWidgets() {
    const ytVideo: YouTubeVideo = await fetchLatestYouTube();
    const cafePosts: CafePost[] = await fetchLiveShipping();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Section 4: Latest YouTube Widget */}
            <a href={ytVideo.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <section className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col h-full group cursor-pointer hover:border-zinc-700 transition-all">
                    <div className="bg-red-500/10 px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <span className="font-bold text-red-400 tracking-tight text-xs">최신 리뷰</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full uppercase tracking-widest animate-pulse">New</span>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-between">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ytVideo.thumbnail} alt="Video Thumbnail" className="opacity-80 group-hover:opacity-100 transition-opacity duration-300 w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                                    <Play className="w-4 h-4 text-white ml-0.5 fill-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mt-2.5 font-semibold text-zinc-200 text-xs line-clamp-2 leading-snug">
                                {ytVideo.title}
                            </h3>
                            <p className="text-[10px] text-zinc-500 mt-1 font-medium">{ytVideo.publishedStr}</p>
                        </div>
                    </div>
                </section>
            </a>

            {/* Section 5: Live Shipping Status (Naver Cafe) */}
            <section className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 flex flex-col h-full hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2.5">
                    <div className="flex items-center space-x-1.5">
                        <BellRing className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                        <h2 className="font-bold text-zinc-100 tracking-tight text-xs">실시간 조립/출고</h2>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-500">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        <span>최근 업데이트</span>
                    </div>
                </div>

                <div className="flex-grow flex flex-col space-y-2.5 relative justify-center">
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-800"></div>

                    {cafePosts.map((post) => (
                        <div key={post.id} className="relative pl-6 group cursor-pointer">
                            <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-zinc-600 ring-2 ring-zinc-900 group-hover:bg-indigo-500 transition-colors"></div>
                            <p className="text-xs text-zinc-300 font-medium group-hover:text-indigo-300 transition-colors truncate">{post.title}</p>
                            <p className="text-[10px] text-zinc-600 mt-0.5">{post.time}</p>
                        </div>
                    ))}
                </div>
                <button className="mt-3 w-full py-2 bg-zinc-800 hover:bg-indigo-500/10 text-indigo-400 font-semibold text-[11px] rounded-lg transition-colors border border-zinc-700 hover:border-indigo-500/30">
                    모든 출고현황 보기
                </button>
            </section>
        </div>
    );
}
