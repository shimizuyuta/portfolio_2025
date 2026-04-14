"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type ArticleInput,
  createArticle,
  deleteArticle,
  getAdminArticleById,
  updateArticle,
  uploadThumbnail,
} from "./actions";

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

type View = "list" | "create" | "edit";

const EMPTY_FORM: ArticleInput = {
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

// ─── inputCls ────────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400";

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

// ─── ArticleForm（コンポーネント外に定義） ────────────────────────────────────
function ArticleForm({
  form,
  setForm,
  tagsInput,
  setTagsInput,
  thumbnailFile,
  setThumbnailFile,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
  error,
}: {
  form: ArticleInput;
  setForm: (f: ArticleInput) => void;
  tagsInput: string;
  setTagsInput: (v: string) => void;
  thumbnailFile: File | null;
  setThumbnailFile: (f: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  isPending: boolean;
  error: string | null;
}) {
  // ローカルプレビュー URL（選択直後）
  const previewUrl = thumbnailFile
    ? URL.createObjectURL(thumbnailFile)
    : (form.thumbnail_url ?? null);

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
        <textarea
          className={`${inputCls} resize-y font-mono text-xs`}
          rows={16}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
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
          onClick={onSubmit}
          disabled={isPending}
          className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-5 py-2 h-auto text-sm"
        >
          {isPending ? "保存中…" : submitLabel}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="rounded-lg h-auto text-sm"
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
}

// ─── AdminClient ──────────────────────────────────────────────────────────────
export default function AdminClient({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const [view, setView] = useState<View>("list");
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState<ArticleInput>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function refreshList() {
    const res = await fetch("/api/admin/articles");
    if (res.ok) setArticles(await res.json());
  }

  function parseTagsInput(): string[] {
    return tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function resolveThumbUrl(): Promise<string | null> {
    if (!thumbnailFile) return form.thumbnail_url;
    const fd = new FormData();
    fd.append("file", thumbnailFile);
    return await uploadThumbnail(fd);
  }

  function handleCreate() {
    setForm(EMPTY_FORM);
    setTagsInput("");
    setThumbnailFile(null);
    setEditingId(null);
    setError(null);
    setView("create");
  }

  function handleSubmitCreate() {
    startTransition(async () => {
      try {
        const thumbnail_url = await resolveThumbUrl();
        await createArticle({
          ...form,
          tagNames: parseTagsInput(),
          thumbnail_url,
        });
        await refreshList();
        setView("list");
      } catch (e) {
        setError(e instanceof Error ? e.message : "作成に失敗しました");
      }
    });
  }

  async function handleEdit(id: string) {
    setError(null);
    const article = await getAdminArticleById(id);
    if (!article) return;
    const tags = article.tagNames ?? [];
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      category: article.category ?? "",
      status: article.status as "draft" | "published",
      published_at: article.published_at ?? null,
      tagNames: tags,
      thumbnail_url: article.thumbnail_url ?? null,
    });
    setTagsInput(tags.join(", "));
    setThumbnailFile(null);
    setEditingId(id);
    setView("edit");
  }

  function handleSubmitEdit() {
    if (!editingId) return;
    startTransition(async () => {
      try {
        const thumbnail_url = await resolveThumbUrl();
        await updateArticle(editingId, {
          ...form,
          tagNames: parseTagsInput(),
          thumbnail_url,
        });
        await refreshList();
        setView("list");
      } catch (e) {
        setError(e instanceof Error ? e.message : "更新に失敗しました");
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`「${title}」を削除しますか？`)) return;
    startTransition(async () => {
      try {
        await deleteArticle(id);
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "削除に失敗しました");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-sky-600 uppercase">
            Local Only
          </p>
          <h1 className="text-xl font-bold text-gray-900">ブログ管理</h1>
        </div>
        {view === "list" && (
          <Button
            onClick={handleCreate}
            className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-4 py-2 h-auto text-sm"
          >
            + 新規作成
          </Button>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* 一覧 */}
        {view === "list" && (
          <div className="space-y-3">
            {articles.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-20">
                記事がありません
              </p>
            )}
            {articles.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge
                      className={`text-xs border ${
                        a.status === "published"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {a.status === "published" ? "公開" : "下書き"}
                    </Badge>
                    {a.category && (
                      <span className="text-xs text-gray-400">
                        {a.category}
                      </span>
                    )}
                    {a.published_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(a.published_at).toLocaleDateString("ja-JP")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(a.id)}
                    className="h-auto py-1.5 px-3 text-xs rounded-lg"
                  >
                    編集
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(a.id, a.title)}
                    disabled={isPending}
                    className="h-auto py-1.5 px-3 text-xs rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 作成 */}
        {view === "create" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">新規作成</h2>
            <ArticleForm
              form={form}
              setForm={setForm}
              tagsInput={tagsInput}
              setTagsInput={setTagsInput}
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              onSubmit={handleSubmitCreate}
              onCancel={() => setView("list")}
              submitLabel="作成する"
              isPending={isPending}
              error={error}
            />
          </div>
        )}

        {/* 編集 */}
        {view === "edit" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">記事を編集</h2>
            <ArticleForm
              form={form}
              setForm={setForm}
              tagsInput={tagsInput}
              setTagsInput={setTagsInput}
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              onSubmit={handleSubmitEdit}
              onCancel={() => setView("list")}
              submitLabel="更新する"
              isPending={isPending}
              error={error}
            />
          </div>
        )}
      </main>
    </div>
  );
}
