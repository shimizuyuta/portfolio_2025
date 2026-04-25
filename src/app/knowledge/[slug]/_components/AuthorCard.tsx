import Image from "next/image";

export function AuthorCard() {
  return (
    <div className="mt-16 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5">
      <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-100">
        <Image
          src="/images/profile.png"
          alt="清水 優太"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">この記事を書いた人</p>
        <p className="text-sm font-bold text-gray-900">清水 優太</p>
        <p className="text-xs text-gray-500 leading-relaxed mt-1">
          社会福祉士 / フリーランスエンジニア（歴6年）。
          福祉×IT・AIを軸に、中小企業向けのAI導入支援・Web制作を行っています。
        </p>
      </div>
    </div>
  );
}
