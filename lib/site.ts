/** URL pública del sitio. En producción es arzenindustrial.com salvo que Vercel defina NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://arzenindustrial.com").replace(/\/$/, "");

export const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/industries/aerospace", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust" },
];

/** Buzón público. El sitio anterior publicaba esta dirección; se cambia con NEXT_PUBLIC_CONTACT_EMAIL. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "network@arzenindustrial.com";

/** mailto: con asunto y cuerpo prellenados (sin datos del visitante: el texto lo escribe su cliente de correo). */
export function mailto(subject: string, body = ""): string {
  const q = [`subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join("&");
  return `mailto:${CONTACT_EMAIL}?${q}`;
}
