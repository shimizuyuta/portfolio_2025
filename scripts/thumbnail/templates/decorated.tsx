import {
  DECORATED,
  DISPLAY_STACK,
  FONT_FAMILY,
  fitTitleSize,
  splitLines,
  type ThumbnailInput,
} from "../theme";

const RIBBON_FONT_SIZE = 52;
const RIBBON_HEIGHT = 104;
const RIBBON_TOP = 56;

/** 太い斜めストライプの開始 x 座標 */
const STRIPES = [120, 300, 560, 900, 1180, 1360];
/** 細いハッチ線の開始 x 座標 */
const HATCH = [60, 78, 96, 640, 658, 676, 1240, 1258, 1276];

/**
 * キラキラ（4点星）。お手本ではイラストの右上に大小2つ置かれている。
 *
 * satori は関数コンポーネントを解決せず host 要素しか辿らないため、
 * `<Sparkle />` と書くと黙って捨てられる。必ず関数として呼ぶこと。
 */
function Sparkle({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const w = r * 0.26;
  return (
    <polygon
      fill={DECORATED.accent}
      points={`${cx},${cy - r} ${cx + w},${cy - w} ${cx + r},${cy} ${cx + w},${cy + w} ${cx},${cy + r} ${cx - w},${cy + w} ${cx - r},${cy} ${cx - w},${cy - w}`}
    />
  );
}

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
  const titleSize = Math.min(fitTitleSize(lines), hasIllustration ? 74 : 84);

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

        {/*
          お手本の背景は「太い白の斜めストライプ + 細いハッチ + 半透明の円」。
          satori は <pattern> を解釈しないので、ストライプは1本ずつ描く。
        */}
        <g opacity="0.3" fill={DECORATED.stripe}>
          {STRIPES.map((x) => (
            <polygon
              key={x}
              points={`${x},-60 ${x + 46},-60 ${x - 214},700 ${x - 260},700`}
            />
          ))}
        </g>
        <g opacity="0.22" stroke={DECORATED.stripe} fill="none" strokeWidth="4">
          {HATCH.map((x) => (
            <line key={x} x1={x} y1="-60" x2={x - 274} y2="700" />
          ))}
        </g>

        {/* なめらかな曲線を重ねて、ストライプの硬さを和らげる */}
        <g opacity="0.26" stroke={DECORATED.stripe} fill="none">
          <path
            d="M-100 150 C 220 10, 520 250, 880 70 S 1260 160, 1380 60"
            strokeWidth="30"
          />
          <path
            d="M-60 600 C 260 460, 560 690, 900 510 S 1280 610, 1400 490"
            strokeWidth="20"
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
            fontFamily: DISPLAY_STACK,
            fontSize: RIBBON_FONT_SIZE,
            fontWeight: 900,
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
                fontFamily: DISPLAY_STACK,
                fontSize: titleSize,
                fontWeight: 900,
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
                fontWeight: 900,
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
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 320,
              height: 320,
              marginRight: 44,
            }}
          >
            {/* キラキラはイラストの右上に重ねる（お手本と同じ配置） */}
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {Sparkle({ cx: 278, cy: 44, r: 30 })}
              {Sparkle({ cx: 232, cy: 96, r: 17 })}
            </svg>
            <img
              src={input.illustration}
              width={260}
              height={260}
              alt=""
              style={{ marginTop: 40, objectFit: "contain" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
