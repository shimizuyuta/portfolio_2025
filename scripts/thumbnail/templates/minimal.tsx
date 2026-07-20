import {
  COLORS,
  FONT_FAMILY,
  fitTitleSize,
  splitLines,
  type ThumbnailInput,
} from "../theme";

/**
 * テンプレA（ミニマル）— tmp/サムネお手本/image.png 準拠。
 * ハウツー・比較・検証など、内容で読ませる記事向け。
 */
export function Minimal(input: ThumbnailInput) {
  const lines = splitLines(input.title);
  const titleSize = fitTitleSize(lines);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: COLORS.surface,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* 左端のアクセントバー */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 18,
          height: "100%",
          background: COLORS.primary,
          display: "flex",
        }}
      />

      {/* 右上の装飾円。一部を画面外に逃がして余白に動きを出す */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 440,
          height: 440,
          borderRadius: 220,
          background: COLORS.decoration,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          width: "100%",
          height: "100%",
        }}
      >
        {input.badge ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              background: COLORS.primary,
              color: COLORS.white,
              borderRadius: 999,
              padding: "14px 30px",
              fontSize: 26,
              fontWeight: 700,
              marginBottom: 34,
            }}
          >
            {/*
              ◆(U+25C6) は Noto Sans JP の japanese/latin サブセットに無く豆腐になる。
              フォントを増やさずに済むよう、正方形を45度回して菱形として描く。
            */}
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                background: COLORS.white,
                transform: "rotate(45deg)",
                marginRight: 16,
              }}
            />
            <span>{input.badge}</span>
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                color: COLORS.foreground,
                lineHeight: 1.32,
                letterSpacing: -1,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {input.subtitle ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: 96,
                height: 7,
                borderRadius: 4,
                background: COLORS.primary,
                margin: "34px 0 26px",
              }}
            />
            <div
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: COLORS.muted,
              }}
            >
              {input.subtitle}
            </div>
          </div>
        ) : null}

        {input.brand ? (
          <div
            style={{
              display: "flex",
              marginTop: 56,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            <span style={{ color: COLORS.primary }}>{input.brand}</span>
            {input.brandSuffix ? (
              <span style={{ color: COLORS.muted, marginLeft: 12 }}>
                {`/ ${input.brandSuffix}`}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
