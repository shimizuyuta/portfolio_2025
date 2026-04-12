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

  // /dev start #123
  const match = text.match(/^start\s+#?(\d+)$/);
  if (match) {
    const issueNumber = match[1];

    await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/claude-implement.yml/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: "main",
          inputs: { issue_number: issueNumber },
        }),
      },
    );

    await postToSlack(
      responseUrl,
      `🚀 Issue #${issueNumber} の実装を開始しました。\nGitHub Actions が起動しています...`,
    );
    return NextResponse.json({ response_type: "in_channel" });
  }

  return NextResponse.json({
    text: "使い方:\n• `/dev start #<Issue番号>` — Issue の実装を開始",
  });
}
