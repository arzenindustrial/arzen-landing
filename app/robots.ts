import type { MetadataRoute } from "next";
import { SITE_URL as site } from "@/lib/site";


export default function robots(): MetadataRoute.Robots {
  return {
    // El producto, el acceso y los reportes compartidos nunca se indexan.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/app/", "/login", "/signup", "/r/"] }],
    sitemap: `${site}/sitemap.xml`,
  };
}
