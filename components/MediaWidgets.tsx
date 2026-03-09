import { Youtube, Play, BellRing, Clock } from "lucide-react";
import { fetchLatestYouTube, fetchLiveShipping, YouTubeVideo, CafePost } from "@/lib/fetchers/mediaCrawler";

export default async function MediaWidgets() {
    const ytVideo: YouTubeVideo = await fetchLatestYouTube();
    const cafePosts: CafePost[] = await fetchLiveShipping();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 4: Latest YouTube Widget */}
            <a href={ytVideo.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group cursor-pointer hover:shadow-md transition-shadow">
                    <div className="bg-red-50 p-4 pb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Youtube className="w-5 h-5 text-red-600" />
                            <span className="font-bold text-red-900 tracking-tight text-sm">최신 리뷰 & 소식</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full uppercase tracking-widest animate-pulse">New</span>
                    </div>
                    <div className="p-4 pt-2 flex flex-col flex-grow justify-between">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ytVideo.thumbnail} alt="Video Thumbnail" className="opacity-80 group-hover:opacity-100 transition-opacity duration-300 w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                                    <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mt-3 font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">
                                {ytVideo.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 font-medium">{ytVideo.publishedStr}</p>
                        </div>
                    </div>
                </section>
            </a>

            {/* Section 5: Live Shipping Status (Naver Cafe) */}
            <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                    <div className="flex items-center space-x-2">
                        <BellRing className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                        <h2 className="font-bold text-gray-900 tracking-tight text-sm">실시간 조립/출고 현황</h2>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>최근 업데이트</span>
                    </div>
                </div>

                <div className="flex-grow flex flex-col space-y-3 relative justify-center">
                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>

                    {cafePosts.map((post) => (
                        <div key={post.id} className="relative pl-8 group cursor-pointer">
                            <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-gray-300 ring-4 ring-white group-hover:bg-indigo-500 transition-colors"></div>
                            <p className="text-sm text-gray-700 font-medium group-hover:text-indigo-600 transition-colors truncate">{post.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
                        </div>
                    ))}
                </div>
                <button className="mt-4 w-full py-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-xl transition-colors">
                    모든 출고현황 보기
                </button>
            </section>
        </div>
    );
}
