import { ImageResponse } from "next/og";

export const alt = "Synergy Business — Business Setup in Abu Dhabi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg,#0a2540 0%,#071a2e 100%)",
          color: "#FFFFFF",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            color: "#C9A84C",
            fontSize: 36,
            letterSpacing: 4,
            display: "flex",
          }}
        >
          SYNERGY BUSINESS
        </div>
        <div
          style={{
            fontSize: 84,
            lineHeight: 1.05,
            fontWeight: 600,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Business Setup</span>
          <span>in Abu Dhabi.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#E2E8F0",
          }}
        >
          <span>Mainland · Free Zone · Visas · PRO</span>
          <span style={{ color: "#C9A84C" }}>synergybusiness.ae</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
