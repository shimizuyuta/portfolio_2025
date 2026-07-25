"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// コードブロック（<pre>）をコピーボタン付きで描画するクライアントコンポーネント。
// ArticleBody（Server Component）から react-markdown の pre 差し替えとして使う。
// コピー対象のテキストは、rehypeHighlight が付けた span を無視して
// 描画済み DOM の textContent から取る（ハイライトの有無に依存しないため）。
export function CodeBlock({ children }: { children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボード API が使えない環境では何もしない
    }
  };

  return (
    <div className="group relative">
      <pre ref={preRef}>{children}</pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "コピーしました" : "コードをコピー"}
        className={cn(
          "absolute right-2 top-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs",
          "border border-gray-300 bg-white/80 text-gray-600 backdrop-blur-sm transition",
          "opacity-0 hover:bg-white hover:text-gray-900 focus-visible:opacity-100 group-hover:opacity-100",
        )}
      >
        {copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            コピー済み
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            コピー
          </>
        )}
      </button>
    </div>
  );
}
