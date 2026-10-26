# arzen-landing — sitio público de Arzen (arzenindustrial.com)

Este repo es un **espejo de despliegue**. El código fuente vive en `arzen-crm/v3/web` (privado) y se copia aquí con
`v3/scripts/sync-landing.sh`. No editar aquí: los cambios se pierden en la siguiente sincronización.

Next.js 14 (App Router) + Tailwind. Vercel construye con `vercel.json` (`framework: nextjs`).
Variables públicas en Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_DEMO`. Sin API ni Supabase, el sitio funciona en modo demostración.

El sitio anterior (intermediación) está en el historial de git; sus URLs redirigen con 308 (ver `next.config.mjs`).
