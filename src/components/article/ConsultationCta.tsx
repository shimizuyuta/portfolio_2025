import Link from "next/link";

export function ConsultationCta() {
  return (
    <div className="mt-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 px-8 py-10 text-white text-center shadow-lg">
      <p className="text-sm font-semibold tracking-widest uppercase opacity-80 mb-3">
        Free Consultation
      </p>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
        AI・ITの導入、一緒に考えます
      </h2>
      <p className="text-sm md:text-base opacity-90 mb-8 leading-relaxed max-w-md mx-auto">
        「何から始めればいい？」「自社に合うか不安」——
        現役エンジニアがあなたの状況に合わせて一緒に整理します。
      </p>
      <Link
        href="/contact"
        className="inline-block bg-white text-sky-600 font-bold text-sm px-8 py-3 rounded-full hover:bg-sky-50 transition-colors duration-200 shadow"
      >
        無料で相談する →
      </Link>
    </div>
  );
}
