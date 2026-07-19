import {
  DECORATED,
  FONT_FAMILY,
  fitTitleSize,
  splitLines,
  type ThumbnailInput,
} from "../theme";

const RIBBON_FONT_SIZE = 52;
const RIBBON_HEIGHT = 104;
const RIBBON_TOP = 56;

/**
 * テンプレB（装飾）— tmp/サムネお手本/image copy.png 準拠。
 * 年度版・トレンド解説など、一覧で目を引かせたい記事向け。
 *
 * イラストは任意。渡されなければカードを全幅にして成立させる。
 */
export function Decorated(input: ThumbnailInput) {
  const hasIllustration = Boolean(input.illustration);
  // 日本語は概ね1文字=1em。左右の余白と切り欠き分を足してリボン幅を決める
  const ribbonWidth = Math.min(
    980,
    Math.round(RIBBON_FONT_SIZE * (input.badge?.length ?? 0) + 150),
  );
  const lines = splitLines(input.title);
  // イラストがある分だけ本文の使える幅が狭くなるので、見積もりを詰める
  const titleSize = Math.min(fitTitleSize(lines), hasIllustration ? 66 : 84);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundImage: `linear-gradient(135deg, ${DECORATED.bgFrom} 0%, ${DECORATED.bgTo} 100%)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* 装飾背景。satori は inline SVG を描画できるので、斜線と円はここで持つ */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* satori は <title> を画像内のテキストとして組んでしまうため置かない */}
        <g opacity="0.28" stroke={DECORATED.stripe} fill="none">
          <path
            d="M-100 120 C 200 -20, 480 220, 820 40 S 1240 120, 1360 20"
            strokeWidth="26"
          />
          <path
            d="M-100 250 C 220 90, 520 330, 880 140 S 1260 240, 1380 130"
            strokeWidth="10"
          />
          <path
            d="M-60 610 C 260 470, 560 700, 900 520 S 1280 620, 1400 500"
            strokeWidth="18"
          />
        </g>
        <g opacity="0.22" fill={DECORATED.stripe}>
          <circle cx="1130" cy="70" r="46" />
          <circle cx="70" cy="560" r="34" />
        </g>
        <g opacity="0.55" fill={DECORATED.accent}>
          <circle cx="1075" cy="52" r="26" />
        </g>

        {/*
          リボンの形。CSS の clipPath は使わない — satori が自分自身を参照する
          clip-path（<clipPath id="X" clip-path="url(#X)">）を吐き、ラスタライズが
          破綻するため。inline SVG の polygon なら確実に描ける。
        */}
        {input.badge ? (
          <polygon
            fill={DECORATED.ribbon}
            points={`0,${RIBBON_TOP} ${ribbonWidth},${RIBBON_TOP} ${ribbonWidth - 46},${RIBBON_TOP + RIBBON_HEIGHT / 2} ${ribbonWidth},${RIBBON_TOP + RIBBON_HEIGHT} 0,${RIBBON_TOP + RIBBON_HEIGHT}`}
          />
        ) : null}
      </svg>

      {/* リボンの文字。形は上の SVG が持つので、ここは配置だけ */}
      {input.badge ? (
        <div
          style={{
            position: "absolute",
            top: RIBBON_TOP,
            left: 0,
            display: "flex",
            alignItems: "center",
            height: RIBBON_HEIGHT,
            width: ribbonWidth,
            paddingLeft: 56,
            color: "#ffffff",
            fontSize: RIBBON_FONT_SIZE,
            fontWeight: 700,
          }}
        >
          {input.badge}
        </div>
      ) : null}

      {/* 本文カード */}
      <div
        style={{
          position: "absolute",
          top: input.badge ? 178 : 96,
          left: 56,
          right: 56,
          bottom: 56,
          display: "flex",
          alignItems: "center",
          background: DECORATED.card,
          borderRadius: 18,
          opacity: 0.96,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 48px",
          }}
        >
          {lines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                color: DECORATED.title,
                lineHeight: 1.3,
                letterSpacing: -1,
              }}
            >
              {line}
            </div>
          ))}

          {input.subtitle ? (
            <div
              style={{
                fontSize: Math.round(titleSize * 0.56),
                fontWeight: 700,
                color: DECORATED.title,
                marginTop: 26,
                lineHeight: 1.4,
              }}
            >
              {input.subtitle}
            </div>
          ) : null}
        </div>

        {hasIllustration ? (
          <img
            src={input.illustration}
            width={330}
            height={330}
            alt=""
            style={{ marginRight: 40, objectFit: "contain" }}
          />
        ) : null}
      </div>
    </div>
  );
}
