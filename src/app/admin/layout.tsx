import Link from "next/link";
import { notFound } from "next/navigation";

// 管理画面は常に最新の DB を見るため、静的プリレンダリングしない。
// ビルド時に /admin を生成しようとすると ADMIN_ENABLED の無い環境で
// データ取得が Forbidden になる。
export const dynamic = "force-dynamic";

// ADMIN_ENABLED はここと各ページの assertAdminPage() の両方で判定する。
// layout だけでは足りない：Next.js は layout と page のデータ取得を独立して
// 実行するため、layout が notFound() を投げてもページ側の取得処理は走る。
//
// actions.ts 側の assertAdminEnabled() はさらに別で、Server Action が
// 外部から直接叩かれる経路を塞ぐもの。3つとも守る対象が違う。
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
