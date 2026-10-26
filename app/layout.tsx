import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL as site } from "@/lib/site";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });


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
