import Link from "next/link";
import { notFound } from "next/navigation";

// ADMIN_ENABLED の判定はここに集約する。ページごとに書くと追加時に
// 書き忘れる余地が残るため。
//
// actions.ts 側の assertAdminEnabled() は別途必要：あちらは Server Action が
// 外部から直接叩かれる経路を塞ぐもので、このガードとは守る対象が違う。
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.ADMIN_ENABLED) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <Link href="/admin" className="inline-block">
          <p className="text-xs font-bold tracking-[0.2em] text-sky-600 uppercase">
            Local Only
          </p>
          <h1 className="text-xl font-bold text-gray-900">ブログ管理</h1>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
