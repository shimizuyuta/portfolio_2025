import { NextResponse } from "next/server";
import { postToSlack, verifySlackSignature } from "@/lib/slack";

const GITHUB_OWNER = "shimizuyuta";
const GITHUB_REPO = "portfolio_2025";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-slack-signature") ?? "";
  const timestamp = request.headers.get("x-slack-request-timestamp") ?? "";
  const signingSecret = process.env.SLACK_SIGNING_SECRET ?? "";

  if (!verifySlackSignature(signingSecret, signature, timestamp, rawBody)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const text = params.get("text")?.trim() ?? "";
  const responseUrl = params.get("response_url") ?? "";

  // /issue list
  if (text === "list") {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    const issues = await res.json();

    if (!Array.isArray(issues) || issues.length === 0) {
      await postToSlack(responseUrl, "オープンな Issue はありません。");
      return NextResponse.json({ response_type: "in_channel" });
    }

    const list = issues
      .map(
        (i: { number: number; title: string; html_url: string }) =>
          `• #${i.number} ${i.title}\n  ${i.html_url}`,
      )
      .join("\n");

    await postToSlack(responseUrl, `*オープンな Issue 一覧*\n${list}`);
    return NextResponse.json({ response_type: "in_channel" });
  }

  // /issue create <title>
  if (text.startsWith("create ")) {
    const title = text.replace(/^create\s+/, "");
    if (!title) {
      return NextResponse.json({
        text: "タイトルを入力してください。例: `/issue create バグ修正`",
      });
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      },
    );
    const issue = await res.json();

    await postToSlack(
      responseUrl,
      `✅ Issue を作成しました\n*#${issue.number} ${issue.title}*\n${issue.html_url}`,
    );
    return NextResponse.json({ response_type: "in_channel" });
  }

  return NextResponse.json({
    text: "使い方:\n• `/issue create <タイトル>` — Issue を作成\n• `/issue list` — Issue 一覧を表示",
  });
}
