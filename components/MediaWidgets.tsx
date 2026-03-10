import { Youtube, Play, BellRing, Clock } from "lucide-react";
import { fetchLatestYouTube, fetchLiveShipping, YouTubeVideo, CafePost } from "@/lib/fetchers/mediaCrawler";

export default async function MediaWidgets() {
    const ytVideo: YouTubeVideo = await fetchLatestYouTube();
    const cafePosts: CafePost[] = await fetchLiveShipping();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 최신 리뷰 (YouTube) */}
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

            {/* 실시간 조립/출고 - 사진 그리드 */}
            <section className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col h-full hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                    <div className="flex items-center space-x-1.5">
                        <BellRing className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                        <h2 className="font-bold text-zinc-100 tracking-tight text-xs">실시간 조립/출고</h2>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-500">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        <span>3h 갱신</span>
                    </div>
                </div>

                {/* 썸네일(1:1) + 텍스트 리스트 */}
                <div className="flex-grow flex flex-col divide-y divide-zinc-800">
                    {cafePosts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-800/60 transition-colors"
                        >
                            {/* 1:1 썸네일 */}
                            <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-zinc-800">
                                {post.img ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.img}
                                        alt={post.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <BellRing className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            {/* 텍스트 */}
                            <div className="min-w-0">
                                <p className="text-xs text-zinc-300 font-medium group-hover:text-indigo-300 transition-colors truncate leading-tight">{post.title}</p>
                                <p className="text-[10px] text-zinc-600 mt-0.5">{post.time}</p>
                            </div>
                        </a>
                    ))}
                </div>

                <a
                    href="https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 mb-2 py-2 bg-zinc-800 hover:bg-indigo-500/10 text-indigo-400 font-semibold text-[11px] rounded-lg transition-colors border border-zinc-700 hover:border-indigo-500/30 text-center block"
                >
                    모든 출고현황 보기
                </a>
            </section>
        </div>
    );
}
