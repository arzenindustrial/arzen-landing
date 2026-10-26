/** URL pública del sitio. En producción es arzenindustrial.com salvo que Vercel defina NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://arzenindustrial.com").replace(/\/$/, "");

export const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/industries/aerospace", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust" },
];
