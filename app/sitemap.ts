import type { MetadataRoute } from "next";
import { SITE_URL as site } from "@/lib/site";

const PATHS = ["/", "/check", "/pricing", "/sample-report", "/trust", "/limits",
  "/industries/aerospace", "/industries/medical", "/industries/oil-gas", "/industries/automotive"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-25");
  return PATHS.map((p) => ({ url: `${site}${p}`, lastModified, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
