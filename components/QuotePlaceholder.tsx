import { Monitor } from "lucide-react";

export default function QuotePlaceholder() {
    return (
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center min-h-[160px] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">선택하신 기본 견적</h2>
            <p className="text-sm text-gray-400 mt-2 text-center text-balance font-medium">
                퀘이사존 게시글에서 등록한 견적이 이곳에 요약됩니다.
            </p>
        </section>
    );
}
