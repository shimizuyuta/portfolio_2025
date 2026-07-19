"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ArticleBody } from "@/components/ArticleBody";
import { Button } from "@/components/ui/button";
import { type ArticleInput, uploadThumbnail } from "../actions";

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

// ─── ImageUploader ────────────────────────────────────────────────────────────
function ImageUploader() {
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const uploaded = await uploadThumbnail(fd);
      setUrl(uploaded);
      setCopied(false);
    });
    e.target.value = "";
  }

  function handleCopy() {
    if (!url) return;
    navigator.clipboard.writeText(`![](${url})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 space-y-2">
      <p className="text-xs font-medium text-gray-500">
        本文用 画像アップロード
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="cursor-pointer">
          <span className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            {isPending ? "アップロード中…" : "ファイルを選択"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFile}
            disabled={isPending}
          />
        </label>
        {url && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <code className="text-xs text-gray-500 truncate flex-1 bg-white border border-gray-200 rounded px-2 py-1">
              {`![](${url})`}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
            >
              {copied ? "コピー済み ✓" : "コピー"}
            </button>
          </div>
        )}
      </div>
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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ローカルプレビュー URL（選択直後）
  const previewUrl = thumbnailFile
    ? URL.createObjectURL(thumbnailFile)
    : (form.thumbnail_url ?? null);

  const outline = getOutline(form.content);

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        // 新しいファイルが選ばれていればアップロードして差し替える
        let thumbnail_url = form.thumbnail_url;
        if (thumbnailFile) {
          const fd = new FormData();
          fd.append("file", thumbnailFile);
          thumbnail_url = await uploadThumbnail(fd);
        }

        await onSubmit({
          ...form,
          thumbnail_url,
          tagNames: tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
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
          <textarea
            className={`${inputCls} resize-y font-mono text-xs`}
            rows={16}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
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

      <ImageUploader />

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
    </div>
  );
}
