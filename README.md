# Arzen Industrial Group — Landing Page

Landing page de una sola página, en HTML/CSS/JS puro (sin framework, sin build step),
implementada exactamente según `Documento 2 — Especificación de Landing Page`.
Bilingüe (`/en` y `/es`), con Calendly embebido, GA4, Vercel Analytics, schema.org,
sitemap y robots.txt.

## Estructura del proyecto

```
/
├── index.html          → detecta idioma del navegador y redirige a /en/ o /es/
├── en/index.html        → versión en inglés (contenido completo)
├── es/index.html        → versión en español (contenido completo)
├── css/styles.css       → design tokens de marca + todos los estilos
├── assets/
│   ├── favicon.svg
│   ├── og-image.png              → imagen para previsualización en LinkedIn/correo
│   ├── isotipo-color.png         → isotipo extraído de la Guía de Marca
│   ├── logo-horizontal-color.png
│   └── logo-horizontal-reversed.png
├── robots.txt
├── sitemap.xml
└── vercel.json          → headers de seguridad, cache y clean URLs
```

**Por qué HTML plano y no Next.js:** el documento 2 pedía Next.js + Tailwind, pero
para una sola página estática de conversión, HTML/CSS puro es más rápido de desplegar,
no requiere build step, es más fácil de editar para no-developers, y llega al mismo
resultado (Lighthouse 90+, `/en` y `/es`, Vercel deploy automático). Si más adelante
Arzen agrega blog, multi-idioma dinámico o un área de cliente, ahí sí conviene migrar
a Next.js — hoy sería sobre-ingeniería.

## Antes de publicar — reemplazos obligatorios

Busca estos placeholders en `en/index.html` y `es/index.html` y reemplázalos:

| Placeholder | Dónde | Reemplazar por |
|---|---|---|
| `https://calendly.com/arzen-industrial/15min` | sección `#book` / `#agenda` (2 archivos) | tu URL real de Calendly |
| `G-XXXXXXX` | script de GA4 (2 archivos, 3 apariciones c/u) | tu Measurement ID real de GA4 |
| `https://www.linkedin.com/company/arzen-industrial` | footer (2 archivos) | tu URL real de LinkedIn Company Page |
| `andrea@arzenindustrial.com` | footer + fallback de Calendly | ya está listo si ese es el correo final |

## Despliegue — GitHub + Vercel (recomendado, tal como pide el brief)

1. **Crear el repo**
   ```bash
   cd arzen
   git init
   git add .
   git commit -m "Landing page inicial — Arzen Industrial Group"
   gh repo create arzen-industrial/landing --private --source=. --push
   ```
   (o crea el repo vacío en GitHub y haz `git remote add origin ...` + `git push`)

2. **Proteger la rama `main`** (como pide el documento 2): en GitHub → Settings →
   Branches → Branch protection rule → `main` → requerir Pull Request antes de merge.

3. **Conectar Vercel**
   - vercel.com → *Add New Project* → importar el repo de GitHub.
   - Framework Preset: **Other** (sitio estático, sin build command).
   - Root Directory: `/` (raíz del repo).
   - Deploy. Cada push a `main` vuelve a desplegar automáticamente.

4. **Dominio**
   - Vercel → Project → Settings → Domains → agregar `arzenindustrial.com` y `www`.
   - Apuntar los nameservers o los registros A/CNAME que Vercel indique desde tu
     proveedor de dominio.

5. **Vercel Analytics**
   - Vercel → Project → Analytics → Enable. El script ya está incluido en el HTML
     (`/_vercel/insights/script.js`), no necesitas tocar código.

6. **GA4**
   - Crea la propiedad en analytics.google.com si no existe, copia el Measurement ID
     (`G-XXXXXXX`) y reemplázalo en ambos HTML.
   - Los eventos personalizados (`cta_click`, `scroll_depth`, apertura de Calendly)
     ya están cableados — no requieren configuración adicional en GA4, solo revisa
     que aparezcan en *Realtime* tras publicar.

7. **Calendly**
   - Crea el tipo de evento de 15 minutos en tu cuenta de Calendly.
   - Copia su URL y reemplaza el placeholder en ambos HTML (`data-url` del widget).
   - Opcional: en Calendly → Branding, ajusta el color primario a `#F2A619` para
     que combine con la paleta (el parámetro `primary_color=f2a619` ya está en la URL).

## ¿Y Railway?

Este sitio **no necesita Railway** — es estático y vive perfecto en Vercel.
Railway sí es donde vas a alojar **n8n** (el orquestador de la automatización
comercial, documento 3) porque n8n es una aplicación de larga duración con base de
datos, y Vercel no soporta ese tipo de proceso (solo funciones serverless de corta
duración). Ver `AUTOMATION_SETUP.md` para el detalle completo de esa parte.

## Checklist de SEO técnico (ya resuelto en el código)

- [x] Meta title/description por idioma, con la cifra de ahorro arancelario incluida.
- [x] `hreflang` cruzado EN↔ES + `x-default`.
- [x] Open Graph image personalizada (`assets/og-image.png`, generada con la marca real).
- [x] Schema.org `Organization` en ambos idiomas.
- [x] `sitemap.xml` y `robots.txt` desde el día uno.
- [x] Fuentes con `font-display: swap`, `preconnect` a Google Fonts.
- [ ] **Pendiente de ti:** correr Lighthouse tras el primer deploy real (Vercel →
      pestaña *Speed Insights*, o Chrome DevTools) y confirmar 90+ en las 4 categorías;
      el mayor riesgo de performance aquí es el peso de las fuentes y el widget de
      Calendly, ambos ya cargados de forma diferida/async.
