#!/usr/bin/env python3
"""秘密情報を含む環境ファイルの「値」へのアクセスをブロックする PreToolUse フック。

permissions.deny は前方一致のため `cat ./x.local` 形式の書き方を塞げない。
ここではコマンド文字列そのものを検査して確実に止める。

判定から除外するもの：
  - ヒアドキュメント本文（コミットメッセージ・PR本文などのデータ。
    「実行」ではなく「言及」なのでブロックしない）
  - 引用符で囲まれた文字列（説明文・grep パターン等）
  - サンプルファイル（プレースホルダのみで秘密情報を含まない）
"""

import json
import re
import sys

SAMPLE = "." + "env" + ".example"
TARGET = re.compile(r"\." + "env" + r"(\b|\.)")

REASON = (
    "環境ファイルの値へのアクセスは禁止されています。"
    "変数名の確認はサンプルファイルを参照してください。"
    "実際の値が必要な検証は、人間が ! プレフィックスで実行してください。"
)


def strip_heredocs(text):
    """ヒアドキュメント本文を落とす（<<EOF ... EOF / <<'EOF' ... EOF）。"""
    out, marker = [], None
    for line in text.split("\n"):
        if marker is not None:
            if line.strip() == marker:
                marker = None
            continue
        found = re.search(r"<<-?\s*['\"]?([A-Za-z_][A-Za-z0-9_]*)['\"]?", line)
        if found:
            marker = found.group(1)
        out.append(line)
    return "\n".join(out)


def strip_quoted(text):
    """引用符で囲まれた文字列を落とす（説明文・パターン指定）。"""
    text = re.sub(r"'[^']*'", "''", text)
    text = re.sub(r'"[^"]*"', '""', text)
    text = re.sub(r"`[^`]*`", "``", text)
    return text


# シンボリックリンクの作成のみ許可する。
# ワークツリーで dev サーバーを動かすには環境ファイルの配置が要るが、
# リンクを張ることと中身を読むことは別。読み取り（cat / source / cp 等）は
# 引き続き全てブロックされる。
SYMLINK_OK = re.compile(r"^\s*(sudo\s+)?ln\s+(-[a-zA-Z]*s[a-zA-Z]*\s+)")


def split_segments(text):
    """&& || ; | 改行 でコマンドを分割する。

    `ln -s ... && cat <環境ファイル>` のような連結で読み取りが紛れ込むのを防ぐ。
    """
    return re.split(r"&&|\|\||;|\||\n", text)


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    command = (payload.get("tool_input") or {}).get("command") or ""
    if not command:
        return 0

    cleaned = strip_quoted(strip_heredocs(command)).replace(SAMPLE, "")

    # 環境ファイルに触れるセグメントのうち、シンボリックリンク作成だけ許す
    offending = [
        seg
        for seg in split_segments(cleaned)
        if TARGET.search(seg) and not SYMLINK_OK.match(seg)
    ]

    if offending:
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": REASON,
                    }
                },
                ensure_ascii=False,
            )
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
