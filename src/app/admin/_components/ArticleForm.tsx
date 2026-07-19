"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleView } from "@/components/ArticleView";
import { Button } from "@/components/ui/button";
import { type ArticleInput, uploadImage } from "../actions";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const EMPTY_FORM: ArticleInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  status: "draft",
  published_at: null,
  tagNames: [],
  thumbnail_url: null,
};

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400";

// ─── 本文タブ ────────────────────────────────────────────────────────────────
// shadcn の Tabs は未導入のため、依存を増やさず組む。
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-xs transition-colors ${
        active
          ? "bg-sky-600 font-bold text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

// blog.md が数値で規定している項目（見出し階層・文字数）を書きながら確認する。
// h4 以下は規約で禁止のため、使われていたら警告する。
function getOutline(content: string) {
  const lines = content.split("\n");
  return {
    chars: content.length,
    h2: lines.filter((l) => /^##\s/.test(l)).length,
    h3: lines.filter((l) => /^###\s/.test(l)).length,
    hasDeepHeading: lines.some((l) => /^#{4,}\s/.test(l)),
  };
}

// ─── Field（コンポーネント外に定義してフォーカス問題を回避） ──────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {children}
    </div>
  );
}

// 本文の指定位置に画像記法を差し込む。
// 画像は行単位のブロックとして置きたいので、前後が改行でなければ補う。
// caret は `![` の直後を指す（挿入直後に alt をそのまま打てるようにするため）。
function insertImageMarkdown(content: string, at: number, url: string) {
  const before = content.slice(0, at);
  const after = content.slice(at);
  const prefix = before === "" || before.endsWith("\n") ? "" : "\n";
  const suffix = after === "" || after.startsWith("\n") ? "" : "\n";
  return {
    text: `${before}${prefix}![](${url})${suffix}${after}`,
    caret: before.length + prefix.length + 2,
  };
}

// ─── 記事全体プレビュー ───────────────────────────────────────────────────────
// 公開ページと同じ ArticleView を、画面全体を覆うレイヤーに描画する。
// 編集フォームの列は幅が狭く、記事の実寸レイアウトを再現できないため。
function FullPreviewOverlay({
  form,
  tagNames,
  thumbnailUrl,
  unoptimizedImage,
  onClose,
}: {
  form: ArticleInput;
  tagNames: string[];
  thumbnailUrl: string | null;
  unoptimizedImage: boolean;
  onClose: () => void;
}) {
  // Escape で閉じる。開いている間は背後のフォームをスクロールさせない。
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2">
        <span className="text-xs font-bold text-amber-800">
          プレビュー（未保存の内容）
        </span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md border border-amber-300 bg-white px-3 py-1 text-xs text-amber-900 transition-colors hover:bg-amber-100"
        >
          閉じる（Esc）
        </button>
      </div>

      <ArticleView
        title={form.title || "（タイトル未入力）"}
        category={form.category || "未分類"}
        tags={tagNames}
        content={form.content}
        thumbnailUrl={thumbnailUrl}
        publishedAt={form.published_at}
        unoptimizedImage={unoptimizedImage}
      />
    </div>
  );
}

// ─── ArticleForm ──────────────────────────────────────────────────────────────
// 入力状態はこのコンポーネントが持ち、呼び出し側は初期値と保存処理だけを渡す。
// 新規作成と編集で入力欄の実装が分岐しないようにするため。
export function ArticleForm({
  initialForm,
  submitLabel,
  onSubmit,
}: {
  initialForm: ArticleInput;
  submitLabel: string;
  onSubmit: (input: ArticleInput) => Promise<void>;
}) {
  const [form, setForm] = useState<ArticleInput>(initialForm);
  const [tagsInput, setTagsInput] = useState(initialForm.tagNames.join(", "));
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [contentTab, setContentTab] = useState<"edit" | "preview">("edit");
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 本文への画像挿入
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // ペースト・ドロップ・ファイル選択の3経路から共通で呼ぶ。
  async function uploadAndInsert(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(`対応していない形式です（${file.type || "不明"}）`);
      return;
    }
    // await を挟むとフォーカスが外れて選択位置が失われるため、先に控える
    const at = textareaRef.current?.selectionStart ?? form.content.length;
    setUploadError(null);
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadImage(fd);
      // await 後なので、古い content を掴まないよう関数形式で更新する
      let caret = at;
      setForm((prev) => {
        const next = insertImageMarkdown(prev.content, at, url);
        caret = next.caret;
        return { ...prev, content: next.text };
      });
      // value の反映後にキャレットを戻す
      setTimeout(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.focus();
        ta.setSelectionRange(caret, caret);
      }, 0);
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "画像のアップロードに失敗しました",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files)[0];
    if (!file) return; // 通常のテキストペーストは邪魔しない
    e.preventDefault();
    void uploadAndInsert(file);
  }

  function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    setIsDragOver(false);
    const file = Array.from(e.dataTransfer.files)[0];
    if (!file) return;
    e.preventDefault();
    void uploadAndInsert(file);
  }

  // ローカルプレビュー URL（選択直後）
  const previewUrl = thumbnailFile
    ? URL.createObjectURL(thumbnailFile)
    : (form.thumbnail_url ?? null);

  const outline = getOutline(form.content);

  // 保存時とプレビューで同じ解釈になるよう、タグ名の導出は一箇所にまとめる
  const tagNames = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        // 新しいファイルが選ばれていればアップロードして差し替える
        let thumbnail_url = form.thumbnail_url;
        if (thumbnailFile) {
          const fd = new FormData();
          fd.append("file", thumbnailFile);
          thumbnail_url = await uploadImage(fd);
        }

        await onSubmit({
          ...form,
          thumbnail_url,
          tagNames,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "保存に失敗しました");
      }
    });
  }

  return (
    <div className="space-y-5">
      <Field label="タイトル *">
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Field>

      <Field label="スラッグ *">
        <input
          className={inputCls}
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
      </Field>

      <Field label="カテゴリ *">
        <input
          className={inputCls}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </Field>

      <Field label="タグ（カンマ区切り）">
        <input
          className={inputCls}
          placeholder="例: SEO, マーケティング, Web制作"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </Field>

      <Field label="サムネイル">
        <div className="space-y-2">
          {previewUrl && (
            <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={previewUrl}
                alt="サムネイルプレビュー"
                fill
                className="object-cover"
                unoptimized={!!thumbnailFile}
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailFile(null);
                  setForm({ ...form, thumbnail_url: null });
                }}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70"
              >
                ×
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border file:border-gray-300 file:text-xs file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setThumbnailFile(file);
            }}
          />
          {form.thumbnail_url && !thumbnailFile && (
            <p className="text-xs text-gray-400 truncate">
              {form.thumbnail_url}
            </p>
          )}
        </div>
      </Field>

      <Field label="概要 *">
        <textarea
          className={`${inputCls} resize-none`}
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
      </Field>

      <Field label="本文（Markdown） *">
        <div className="mb-2 flex items-center gap-1">
          <TabButton
            active={contentTab === "edit"}
            onClick={() => setContentTab("edit")}
          >
            編集
          </TabButton>
          <TabButton
            active={contentTab === "preview"}
            onClick={() => setContentTab("preview")}
          >
            プレビュー
          </TabButton>

          {contentTab === "preview" && (
            <span className="ml-auto flex items-center gap-3 text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setIsFullPreviewOpen(true)}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50"
              >
                記事全体を見る
              </button>
              <span>{outline.chars.toLocaleString()}字</span>
              <span>h2: {outline.h2}</span>
              <span>h3: {outline.h3}</span>
              {outline.hasDeepHeading && (
                <span className="font-bold text-red-600">
                  h4以下あり（規約違反）
                </span>
              )}
            </span>
          )}
        </div>

        {contentTab === "edit" ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              className={`${inputCls} resize-y font-mono text-xs ${
                isDragOver ? "border-sky-400 ring-2 ring-sky-300" : ""
              }`}
              rows={16}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes("Files")) {
                  e.preventDefault();
                  setIsDragOver(true);
                }
              }}
              onDragLeave={() => setIsDragOver(false)}
            />

            <div className="flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer">
                <span className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                  {isUploading ? "アップロード中…" : "画像を挿入"}
                </span>
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadAndInsert(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <span className="text-xs text-gray-400">
                カーソル位置に挿入されます。画像のペースト・ドラッグ&ドロップも可
              </span>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}
          </div>
        ) : (
          <div className="min-h-[22rem] rounded-lg border border-gray-300 bg-white px-4 py-3">
            {form.content.trim() ? (
              <ArticleBody content={form.content} />
            ) : (
              <p className="text-sm text-gray-400">
                本文を入力するとプレビューが表示されます
              </p>
            )}
          </div>
        )}
      </Field>

      <Field label="ステータス">
        <select
          className={inputCls}
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as "draft" | "published",
            })
          }
        >
          <option value="draft">下書き</option>
          <option value="published">公開</option>
        </select>
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-5 py-2 h-auto text-sm"
        >
          {isPending ? "保存中…" : submitLabel}
        </Button>
        <Button asChild variant="outline" className="rounded-lg h-auto text-sm">
          <Link href="/admin">キャンセル</Link>
        </Button>
      </div>

      {isFullPreviewOpen && (
        <FullPreviewOverlay
          form={form}
          tagNames={tagNames}
          thumbnailUrl={previewUrl}
          unoptimizedImage={!!thumbnailFile}
          onClose={() => setIsFullPreviewOpen(false)}
        />
      )}
    </div>
  );
}
