type Props = {
  status: string;
  publishedAt: string | null;
};

// 下書きプレビューであることを明示する帯。
// 本番の公開記事と見間違えたまま確認を済ませてしまう事故を防ぐ。
export function PreviewBanner({ status, publishedAt }: Props) {
  const scheduled =
    status === "published" &&
    publishedAt !== null &&
    new Date(publishedAt) > new Date();

  return (
    <div className="sticky top-0 z-50 border-b border-amber-300 bg-amber-100 px-4 py-2.5 text-center">
      <p className="text-sm font-bold text-amber-900">
        プレビュー表示（status: {status}
        {scheduled ? " / 公開予約中" : ""}）
      </p>
      <p className="mt-0.5 text-xs text-amber-800">
        このページは検索エンジンに登録されません。公開するには管理画面から操作してください。
      </p>
    </div>
  );
}
