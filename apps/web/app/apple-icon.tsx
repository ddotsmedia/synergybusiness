import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg,#0a2540 0%,#071a2e 100%)",
          color: "#c9a84c",
          fontFamily: "serif",
          fontSize: 110,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: -4,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
