import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Arzen — Verified before it ships.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Banner del brand book §16: Ink, titular, símbolo invertido. Sin datos de clientes.
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0E1621", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "72px", color: "#F6F4EF", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48">
            <path d="M8 42 L24 6 L40 42 H32.5 L24 22 L15.5 42 Z" fill="#F6F4EF" />
            <rect x="3" y="29" width="42" height="3.2" fill="#6F93FF" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 10 }}>ARZEN</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Verified before it ships.</div>
          <div style={{ fontSize: 30, color: "#B9C0C8" }}>MTR verification and FAIR packages for machine shops.</div>
        </div>
        <div style={{ height: 6, width: 260, background: "#2350D9" }} />
      </div>
    ),
    size,
  );
}
