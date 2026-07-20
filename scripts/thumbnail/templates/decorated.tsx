import {
  DECORATED,
  DISPLAY_STACK,
  FONT_FAMILY,
  fitTitleSize,
  splitLines,
  type ThumbnailInput,
} from "../theme";

const RIBBON_FONT_SIZE = 52;
// お手本の実測（1200幅換算）: リボンは y=74〜164、幅は 9 文字で 709px
const RIBBON_HEIGHT = 90;
const RIBBON_TOP = 74;

/** 太い斜めストライプの開始 x 座標 */
/**
 * 白カードの上端。お手本を実測した値（1200幅換算で y=92）。
 * リボン(top=56)と重なるため、カードより後にリボンを描く必要がある。
 */
const CARD_TOP = 92;

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
    Math.round(RIBBON_FONT_SIZE * (input.badge?.length ?? 0) + 240),
  );
  const lines = splitLines(input.title);
  // イラストがある分だけ本文の使える幅が狭くなるので、見積もりを詰める
  // お手本の実測: 見出しの字高 83px、サブ 55px（1200幅換算）。
  // 太さは Bold(700)。900 にするとインク率が 45.8% になりお手本(40.7%)から
  // 明確に外れる（700 は 40.2% で一致し、字幅/字高比も 8.44 対 8.45 で合う）。
  // イラストがある分だけ本文に使える幅が狭くなるので、幅の見積もりも渡す。
  const titleSize = Math.min(
    fitTitleSize(lines, hasIllustration ? 920 : 980),
    90,
  );

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
      </svg>

      {/* 本文カード */}
      <div
        style={{
          position: "absolute",
          top: input.badge ? CARD_TOP : 96,
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
        {hasIllustration ? (
          <div
            style={{
              display: "flex",
              // お手本のイラストは右下寄り（金色領域 x=809〜, y の重心は下側）。
              // 見出しと重ならない位置まで下げる。
              position: "absolute",
              right: 8,
              top: 150,
              width: 300,
              height: 300,
            }}
          >
            {/* キラキラはイラストの右上に重ねる（お手本と同じ配置） */}
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {Sparkle({ cx: 262, cy: 20, r: 28 })}
              {Sparkle({ cx: 220, cy: 68, r: 16 })}
            </svg>
            <img
              src={input.illustration}
              width={272}
              height={272}
              alt=""
              style={{ marginTop: 28, objectFit: "contain" }}
            />
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingLeft: 48,
            // お手本は本文ブロックがカード中央よりやや下にある（実測で約20px）
            marginTop: 40,
            // イラストは絶対配置なので幅を奪わない。お手本もサブタイトルが
            // イラストの手前まで伸びており、ここを狭めると不要に折り返す。
            paddingRight: hasIllustration ? 116 : 48,
          }}
        >
          {lines.map((line) => (
            <div
              key={line}
              style={{
                fontFamily: DISPLAY_STACK,
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
                fontSize: Math.round(titleSize * 0.66),
                fontWeight: 700,
                color: DECORATED.title,
                marginTop: 34,
                lineHeight: 1.4,
              }}
            >
              {input.subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {/*
        リボンはカードの「後」に描く。satori に z-index は無く、後に書いた要素が
        上に載るため。お手本はリボンが白カードに重なっている。
      */}
      {input.badge ? (
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/*
            リボンの形。CSS の clipPath は使わない — satori が自分自身を参照する
            clip-path（<clipPath id="X" clip-path="url(#X)">）を吐き、ラスタライズが
            破綻するため。inline SVG の polygon なら確実に描ける。
          */}
          <polygon
            fill={DECORATED.ribbon}
            points={`0,${RIBBON_TOP} ${ribbonWidth},${RIBBON_TOP} ${ribbonWidth - 46},${RIBBON_TOP + RIBBON_HEIGHT / 2} ${ribbonWidth},${RIBBON_TOP + RIBBON_HEIGHT} 0,${RIBBON_TOP + RIBBON_HEIGHT}`}
          />
        </svg>
      ) : null}

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
            fontWeight: 700,
          }}
        >
          {input.badge}
        </div>
      ) : null}
    </div>
  );
}
