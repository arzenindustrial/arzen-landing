# Shared rendering helpers for arzenindustrial.com (static site, no framework).
# Run: python3 _build/build.py   (from the repo root). Output = plain HTML files.
import json, re, html

BASE = "https://arzenindustrial.com"
ORG_ID = BASE + "/#organization"
SITE_ID = BASE + "/#website"
EMAIL = "network@arzenindustrial.com"
LINKEDIN = "https://www.linkedin.com/company/arzen-industrial-group/"
LASTMOD = "2026-10-05"
CSS_V = "25"
JS_V = "25"

LOGO_SVG = ('<svg width="28" height="28" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'
            '<polygon points="58,26 20,110 52,110" fill="#1C1E21"/><polygon points="62,26 100,110 68,110" fill="#52606D"/>'
            '<rect x="53" y="14" width="14" height="14" transform="rotate(45 60 21)" fill="#F2A619"/></svg>')
LOGO_SVG_SM = LOGO_SVG.replace('width="28" height="28"', 'width="20" height="20"')

ARROW = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
         'stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>')

UI = {
    "en": {
        "skip": "Skip to content", "home_label": "Arzen Industrial Group, home", "cta": "Request a Consultation",
        "switch_label": "Soy proveedor", "switch_href": "/es/", "other_lang": "es", "other_home": "/es/",
        "nav": [("Services", "/en/services/"), ("Locations", "/en/locations/"), ("Guides", "/en/guides/"),
                ("About", "/en/about/"), ("Contact", "/en/contact/")],
        "menu": "Menu", "crumb_home": "Home", "related": "Related pages", "key": "Key takeaways",
        "faq": "Frequently asked questions", "cta_title": "Tell us what you're sourcing.",
        "cta_text": "A short call is the fastest way to find out whether a verified shop fits your part. We reply within 1 business day.",
        "cta_btn": "Request a consultation", "cta_href": "/en/contact/",
        "foot_services": "Services", "foot_locations": "Locations", "foot_guides": "Guides", "foot_company": "Company",
        "foot_about": "About Arzen", "foot_contact": "Contact", "foot_other": "Español (proveedores)",
        "foot_desc": "Sourcing and in-person verification of CNC, tooling and structural suppliers in Querétaro and Nuevo León, Mexico, for U.S. aerospace and defense procurement teams.",
        "foot_area": "Service area: United States and Mexico (Querétaro, Nuevo León). Work is by appointment — no walk-in office.",
        "locale": "en_US", "locale_alt": "es_MX", "inlang": "en",
        "updated": "Last updated", "home": "/en/",
    },
    "es": {
        "skip": "Saltar al contenido", "home_label": "Arzen Industrial Group, inicio", "cta": "Postúlate como proveedor",
        "switch_label": "I'm a buyer", "switch_href": "/en/", "other_lang": "en", "other_home": "/en/",
        "nav": [("Servicios", "/es/servicios/"), ("Ubicaciones", "/es/ubicaciones/"), ("Guías", "/es/guias/"),
                ("Nosotros", "/es/nosotros/"), ("Contacto", "/es/contacto/")],
        "menu": "Menú", "crumb_home": "Inicio", "related": "Páginas relacionadas", "key": "Puntos clave",
        "faq": "Preguntas frecuentes", "cta_title": "Cuéntanos de tu taller.",
        "cta_text": "Postularte no tiene costo ni compromiso. Respondemos en 1 día hábil.",
        "cta_btn": "Postúlate como proveedor", "cta_href": "/es/contacto/",
        "foot_services": "Servicios", "foot_locations": "Ubicaciones", "foot_guides": "Guías", "foot_company": "Empresa",
        "foot_about": "Sobre Arzen", "foot_contact": "Contacto", "foot_other": "English (buyers)",
        "foot_desc": "Verificación en persona y conexión de talleres de maquinado CNC, tooling y estructuras en Querétaro y Nuevo León con compradores aeroespaciales y de defensa en EE. UU.",
        "foot_area": "Zona de servicio: México (Querétaro, Nuevo León) y Estados Unidos. Trabajamos con cita — no hay oficina de atención sin cita.",
        "locale": "es_MX", "locale_alt": "en_US", "inlang": "es",
        "updated": "Última actualización", "home": "/es/",
    },
}

ORG_DESC = {
    "en": "Arzen Industrial Group is a sourcing and in-person verification intermediary connecting U.S. aerospace and defense procurement teams with vetted CNC machining, tooling and structural-component manufacturers in Querétaro and Nuevo León, Mexico.",
    "es": "Arzen Industrial Group verifica en persona y conecta talleres de maquinado CNC, tooling y componentes estructurales en Querétaro y Nuevo León, México, con compradores aeroespaciales y de defensa en Estados Unidos.",
}


def esc(s):
    return html.escape(s, quote=True)


def strip_tags(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()


def abs_url(path):
    return BASE + path


def area_served():
    return [
        {"@type": "Country", "name": "United States"},
        {"@type": "AdministrativeArea", "name": "Querétaro", "containedInPlace": {"@type": "Country", "name": "Mexico"}},
        {"@type": "AdministrativeArea", "name": "Nuevo León", "containedInPlace": {"@type": "Country", "name": "Mexico"}},
    ]


def org_node(lang):
    return {
        "@type": "Organization",
        "@id": ORG_ID,
        "name": "Arzen Industrial Group",
        "alternateName": "Arzen",
        "url": BASE + "/en/",
        "logo": {"@type": "ImageObject", "@id": BASE + "/#logo", "url": BASE + "/assets/logo-horizontal-color.png",
                 "caption": "Arzen Industrial Group logo"},
        "image": BASE + "/assets/og-image.png",
        "description": ORG_DESC[lang],
        "slogan": "Precision CNC, Tooling & Structural Sourcing — Mexico to Texas",
        "email": EMAIL,
        "founder": {"@type": "Person", "@id": BASE + "/#founder", "name": "Andrea Canabal", "jobTitle": "Founder",
                    "worksFor": {"@id": ORG_ID}},
        "areaServed": area_served(),
        "knowsAbout": ["CNC machining sourcing", "Tooling and fixtures", "Secondary structural components",
                       "Supplier verification", "USMCA nearshoring", "Aerospace and defense procurement"],
        "knowsLanguage": ["en", "es"],
        "contactPoint": [{"@type": "ContactPoint", "contactType": "sales", "email": EMAIL,
                          "availableLanguage": ["English", "Spanish"], "areaServed": ["US", "MX"]}],
        "sameAs": [LINKEDIN],
    }


def website_node():
    return {"@type": "WebSite", "@id": SITE_ID, "url": BASE + "/en/", "name": "Arzen Industrial Group",
            "inLanguage": ["en", "es"], "publisher": {"@id": ORG_ID}}


def breadcrumb_node(url, crumbs):
    return {"@type": "BreadcrumbList", "@id": url + "#breadcrumb",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": abs_url(p)}
                                for i, (n, p) in enumerate(crumbs)]}


def faq_node(url, faqs):
    return {"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}} for q, a in faqs]}


def jsonld(graph):
    return ('<script type="application/ld+json">\n' +
            json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2) +
            "\n</script>")


def nav_html(lang, current):
    u = UI[lang]
    out = []
    for label, href in u["nav"]:
        cur = ' aria-current="page"' if current and current.startswith(href) else ""
        out.append(f'<a href="{href}"{cur}>{label}</a>')
    return "".join(out)


def header_html(lang, current, alt_url, cta_href):
    u = UI[lang]
    alt = alt_url or u["other_home"]
    en_href = f"/en/" if lang == "en" else alt
    es_href = alt if lang == "en" else "/es/"
    if lang == "en":
        sw = (f'<a href="/en/" hreflang="en" lang="en" aria-current="true">EN</a><span aria-hidden="true">/</span>'
              f'<a href="{alt}" hreflang="es" lang="es">ES</a>')
    else:
        sw = (f'<a href="{alt}" hreflang="en" lang="en">EN</a><span aria-hidden="true">/</span>'
              f'<a href="/es/" hreflang="es" lang="es" aria-current="true">ES</a>')
    mobile = "".join(f'<a href="{h}">{l}</a>' for l, h in u["nav"])
    return f'''<header class="site-header">
  <div class="wrap">
    <a class="brand-mark" href="{u["home"]}" aria-label="{u["home_label"]}">
      {LOGO_SVG}
      <span class="wordmark">ARZEN<small>Industrial Group</small></span>
    </a>
    <nav class="primary-nav" aria-label="Primary">{nav_html(lang, current)}</nav>
    <div class="header-right">
      <a class="audience-switch" href="{u["switch_href"]}">{u["switch_label"]}</a>
      <nav class="lang-switch" aria-label="Language selector">{sw}</nav>
      <a class="nav-cta" href="{cta_href}">{u["cta"]}</a>
      <details class="mobile-nav"><summary>{u["menu"]}</summary><nav aria-label="Mobile">{mobile}<a href="{cta_href}" class="mobile-cta">{u["cta"]}</a></nav></details>
    </div>
  </div>
</header>'''


def footer_html(lang, pages):
    u = UI[lang]
    def col(kind, title):
        items = [p for p in pages if p["lang"] == lang and p.get("foot") == kind]
        items.sort(key=lambda p: p.get("order", 0))
        lis = "".join(f'<li><a href="{p["path"]}">{esc(p.get("short", p["h1"]))}</a></li>' for p in items)
        return f'<div><h2 class="foot-h">{title}</h2><ul>{lis}</ul></div>'
    return f'''<footer>
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <a class="f-brand" href="{u["home"]}" aria-label="Arzen Industrial Group">{LOGO_SVG_SM}<span class="wordmark" style="font-size:.85rem;">ARZEN INDUSTRIAL GROUP</span></a>
      <p>{u["foot_desc"]}</p>
      <p class="foot-nap"><a href="mailto:{EMAIL}">{EMAIL}</a><br><a href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></p>
      <p class="foot-area">{u["foot_area"]}</p>
    </div>
    {col("service", u["foot_services"])}
    {col("location", u["foot_locations"])}
    {col("guide", u["foot_guides"])}
    <div><h2 class="foot-h">{u["foot_company"]}</h2><ul>
      <li><a href="{u["nav"][3][1]}">{u["foot_about"]}</a></li>
      <li><a href="{u["nav"][4][1]}">{u["foot_contact"]}</a></li>
      <li><a href="{u["switch_href"]}">{u["foot_other"]}</a></li>
    </ul></div>
  </div>
  <div class="wrap foot-legal"><span>© 2026 Arzen Industrial Group</span></div>
</footer>'''


def head_html(page, alt_pages, extra_graph, lang_ui):
    """Full <head> for generated pages."""
    lang = page["lang"]; u = UI[lang]
    url = abs_url(page["path"])
    title = page["title"]; desc = page["desc"]
    links = [f'<link rel="canonical" href="{url}">']
    if alt_pages:
        for hl, p in alt_pages:
            links.append(f'<link rel="alternate" hreflang="{hl}" href="{abs_url(p)}">')
        xd = [p for hl, p in alt_pages if hl == "en"]
        if xd:
            links.append(f'<link rel="alternate" hreflang="x-default" href="{abs_url(xd[0])}">')
    og_type = "article" if page["kind"] == "guide" else "website"
    img = BASE + "/assets/og-image.png"
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
{chr(10).join(links)}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<meta name="google-site-verification" content="PENDING-PASTE-YOUR-GSC-CODE-HERE">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Arzen Industrial Group">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Arzen Industrial Group logo — Precision CNC, Tooling &amp; Structural Sourcing, Mexico to Texas">
<meta property="og:locale" content="{u["locale"]}">
<meta property="og:locale:alternate" content="{u["locale_alt"]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{img}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css?v={CSS_V}">
{jsonld(extra_graph)}
</head>'''


def scripts_html():
    return f'''<script>
  window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};
</script>
<script defer src="/_vercel/insights/script.js"></script>
<script src="/js/main.js?v={JS_V}"></script>'''
