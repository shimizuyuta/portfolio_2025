#!/usr/bin/env python3
"""
Gemini 画像生成（記事の図・アイキャッチ用）。stdlib のみ。

日本語の図は Gemini 3 世代（既定: gemini-3-pro-image）でほぼ崩れずに作れる。
2.5 世代は日本語が崩れるので使わない。

使い方:
  set -a; source .env.local; set +a        # GEMINI_API_KEY を読み込む
  python3 scripts/gemini-image/gen.py <prompt.txt>
  python3 scripts/gemini-image/gen.py <prompt.txt> --ref path/to/ref.png  # スタイル参照/編集
  python3 scripts/gemini-image/gen.py --list                              # 画像対応モデル一覧
  python3 scripts/gemini-image/gen.py <prompt.txt> --model gemini-3.1-flash-lite-image

環境変数:
  GEMINI_API_KEY      必須（AI Studio のキー）
  GEMINI_IMAGE_MODEL  既定モデル上書き（既定: gemini-3-pro-image）
  GEMINI_OUT_DIR      出力先（既定: tmp/gemini-image/out ← .gitignore 済みの tmp 配下）

出力: <OUT>/<タイムスタンプ>_<モデル>.png と同名 .txt（使用プロンプト）。毎回別名で残す。

料金の目安（gemini-3-pro-image, 1K〜2K）: 約 $0.13/枚（Batch APIで半額）。
"""
import os, sys, json, base64, urllib.request, urllib.error, datetime, pathlib

MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")
KEY = os.environ.get("GEMINI_API_KEY", "").strip()
BASE = "https://generativelanguage.googleapis.com/v1beta"
OUT = pathlib.Path(os.environ.get("GEMINI_OUT_DIR", "tmp/gemini-image/out"))


def die(msg):
    print("ERROR:", msg, file=sys.stderr)
    sys.exit(1)


def list_models():
    with urllib.request.urlopen(f"{BASE}/models?key={KEY}", timeout=30) as r:
        data = json.load(r)
    for m in data.get("models", []):
        name = m.get("name", "")
        if "image" in name.lower() or "imagen" in name.lower():
            print(name, "|", ",".join(m.get("supportedGenerationMethods", [])))
    print("\n（画像対応モデル名を GEMINI_IMAGE_MODEL / --model で指定できます）")


def load_ref(path):
    b = pathlib.Path(path).read_bytes()
    ext = pathlib.Path(path).suffix.lower().lstrip(".")
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/png")
    return {"inline_data": {"mime_type": mime, "data": base64.b64encode(b).decode()}}


def generate(prompt, ref=None):
    parts = [{"text": prompt}]
    if ref:
        parts.append(load_ref(ref))
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}}
    req = urllib.request.Request(
        f"{BASE}/models/{MODEL}:generateContent?key={KEY}",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        die(f"HTTP {e.code}: {e.read().decode()[:500]}")

    OUT.mkdir(parents=True, exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    safe_model = MODEL.replace("/", "_")
    saved = 0
    for cand in data.get("candidates", []):
        for p in cand.get("content", {}).get("parts", []):
            inl = p.get("inlineData") or p.get("inline_data")
            if inl:
                img = base64.b64decode(inl["data"])
                fp = OUT / f"{stamp}_{safe_model}.png"
                fp.write_bytes(img)
                (OUT / f"{stamp}_{safe_model}.txt").write_text(prompt, encoding="utf-8")
                print("SAVED:", fp, f"({len(img)//1024} KB)")
                saved += 1
            elif p.get("text"):
                print("MODEL TEXT:", p["text"][:300])
    if not saved:
        print("画像パートが返りませんでした。生レスポンス先頭:", json.dumps(data)[:400])


if __name__ == "__main__":
    if not KEY:
        die("GEMINI_API_KEY が未設定です（set -a; source .env.local; set +a）")
    args = sys.argv[1:]
    if "--list" in args:
        list_models(); sys.exit(0)
    ref = None
    if "--ref" in args:
        i = args.index("--ref"); ref = args[i + 1]; del args[i:i + 2]
    if "--model" in args:
        i = args.index("--model"); MODEL = args[i + 1]; del args[i:i + 2]
    if not args:
        die("プロンプトファイルを渡してください（例: python3 scripts/gemini-image/gen.py prompt.txt）")
    prompt = pathlib.Path(args[0]).read_text(encoding="utf-8")
    print(f"MODEL={MODEL} / prompt {len(prompt)}字 / ref={ref}")
    generate(prompt, ref)
