import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL as site } from "@/lib/site";

// Fuentes servidas desde el propio sitio (app/fonts, licencia OFL): el build ya no depende de Google Fonts.
const archivo = localFont({
  src: "./fonts/archivo-latin-wdth-normal.woff2", weight: "100 900", style: "normal",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }], variable: "--font-archivo", display: "swap",
});
// next/font se resuelve al compilar: las opciones deben ser literales (sin .map ni plantillas).
const plexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans", display: "swap",
});
const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono", display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Arzen — MTR verification and FAIR packages for machine shops", template: "%s · Arzen" },
  description:
    "Arzen reads your material test reports, checks every chemical and mechanical value against the specification, and builds the audit package. No ERP project.",
  icons: { icon: "/icon.svg" },
  openGraph: { type: "website", siteName: "Arzen" },
};

export const viewport: Viewport = { themeColor: "#0E1621", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
