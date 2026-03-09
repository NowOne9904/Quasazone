import { Monitor } from "lucide-react";

export default function QuotePlaceholder() {
    return (
        <section className="bg-zinc-900/80 rounded-2xl p-5 border border-zinc-800 flex flex-col items-center justify-center min-h-[120px] transition-all duration-300 hover:border-zinc-700">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
                <Monitor className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 tracking-tight">선택하신 기본 견적</h2>
            <p className="text-xs text-zinc-500 mt-1.5 text-center text-balance font-medium">
                퀘이사존 게시글에서 등록한 견적이 이곳에 요약됩니다.
            </p>
        </section>
    );
}
