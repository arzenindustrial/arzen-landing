/** URL pública del sitio. En producción es arzenindustrial.com salvo que Vercel defina NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://arzenindustrial.com").replace(/\/$/, "");
