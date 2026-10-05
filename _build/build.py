#!/usr/bin/env python3
"""Builds the generated pages, patches the existing home/guide pages, and writes
sitemap.xml, llms.txt, robots.txt and 404.html.  Run from the repo root:

    python3 _build/build.py

Idempotent: patching works from the files as they are, but every replacement is
asserted, so a second run on already-patched pages is a no-op / fails loudly.
Re-run content changes by editing content_en.py / content_es.py and running again
(generated pages are always rewritten from scratch)."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from lib import *
import content_en, content_es

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PAGES = content_en.PAGES + content_es.PAGES

# Pages that already exist as hand-written HTML and are patched in place.
EXISTING = [
    dict(key="home-en", lang="en", kind="home", path="/en/", file="en/index.html", short="Home", h1="Home"),
    dict(key="home-es", lang="es", kind="home", path="/es/", file="es/index.html", short="Inicio", h1="Inicio"),
    dict(key="guide-vet", lang="en", kind="guide", path="/en/guides/vet-cnc-supplier-mexico/", file="en/guides/vet-cnc-supplier-mexico/index.html", foot="guide", order=1, short="Vet a CNC supplier in Mexico", h1="How to vet a CNC supplier in Mexico"),
    dict(key="guide-usmca", lang="en", kind="guide", path="/en/guides/usmca-vs-china-sourcing/", file="en/guides/usmca-vs-china-sourcing/index.html", foot="guide", order=2, short="USMCA vs. China sourcing", h1="USMCA vs. China sourcing"),
    dict(key="guide-exportar", lang="es", kind="guide", path="/es/guias/preparar-taller-exportar-eeuu/", file="es/guias/preparar-taller-exportar-eeuu/index.html", foot="guide", order=1, short="Preparar tu taller para exportar", h1="Preparar tu taller para exportar"),
    dict(key="thanks-en", lang="en", kind="thanks", path="/en/thank-you.html", file="en/thank-you.html", short="Thanks", h1="Thanks"),
    dict(key="thanks-es", lang="es", kind="thanks", path="/es/gracias.html", file="es/gracias.html", short="Gracias", h1="Gracias"),
    dict(key="guide-as9100", lang="es", kind="guide", path="/es/guias/as9100-nadcap-certificaciones/", file="es/guias/as9100-nadcap-certificaciones/index.html", foot="guide", order=2, short="¿AS9100 o NADCAP?", h1="AS9100 y NADCAP"),
]
EXISTING_BY_KEY = {p["key"]: p for p in EXISTING}
ALL = {p["key"]: p for p in PAGES + EXISTING}

# Equivalent-page pairs for hreflang (home pairs already carry hreflang in their own HTML).
ALT = {}
for p in PAGES:
    if p.get("alt"):
        ALT[p["key"]] = p["alt"]; ALT[p["alt"]] = p["key"]
ALT["home-en"] = "home-es"; ALT["home-es"] = "home-en"


def alt_pages(key):
    p = ALL[key]
    k2 = ALT.get(key)
    if not k2:
        return None
    q = ALL[k2]
    en = p if p["lang"] == "en" else q
    es = p if p["lang"] == "es" else q
    return [("en", en["path"]), ("es", es["path"])]


def alt_url(key):
    k2 = ALT.get(key)
    return ALL[k2]["path"] if k2 else None


# One-line blurbs for cards (home, hubs, related). Falls back to the meta description.
BLURB = {
    "svc-verification": "We walk the shop floor, confirm equipment and tolerances against real parts, and cross-check references.",
    "svc-cnc": "Precision machined parts from verified shops in Querétaro and Nuevo León.",
    "svc-tooling": "Production, inspection and ground-support tooling from shops we've visited.",
    "svc-structural": "Brackets, supports and other secondary structural parts — not flight-critical primes.",
    "svc-nearshoring": "Move a part from an Asian supplier to a Mexican shop, with USMCA questions raised early.",
    "svc-quoting": "Formal quotes, a physical sample before you commit, and a managed first order.",
    "loc-queretaro": "Central Mexico, an established aerospace manufacturing region.",
    "loc-nuevo-leon": "Northeastern Mexico around Monterrey, the closest of our regions to Texas.",
    "svc-join": "Aplica sin costo y sin compromiso. AS9100 y NADCAP no son obligatorios.",
    "svc-verif-es": "Visitamos tu taller y confirmamos equipo, tolerancias y capacidad real.",
    "svc-buyers-es": "Te presentamos solo con compradores cuyas piezas encajan con tu capacidad.",
    "loc-queretaro-es": "Centro de México, región establecida de manufactura aeroespacial.",
    "loc-nuevo-leon-es": "Noreste de México, área de Monterrey, la región más cercana a Texas.",
}


def blurb(q):
    return BLURB.get(q["key"]) or q.get("desc", "")


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def read_orig(rel):
    """Existing pages are always re-patched from the pristine copies in _build/orig/."""
    with open(os.path.join(ROOT, "_build", "orig", rel), encoding="utf-8") as f:
        return f.read()


# Shorter meta descriptions (<=155 chars) for the pre-existing pages.
DESC_OVERRIDE = {
    "home-en": "CNC, tooling and structural suppliers in Querétaro and Nuevo León, verified in person and matched to U.S. aerospace and defense buyers. Request a consultation.",
    "home-es": "Únete a la red de talleres CNC, tooling y estructuras en Querétaro y Nuevo León verificados por Arzen y conectados con compradores de EE. UU. Sin costo.",
    "guide-vet": "A practical checklist for vetting CNC and tooling suppliers in Mexico before your first purchase order: equipment, tolerances, references and red flags.",
    "guide-exportar": "Guía para talleres CNC de Querétaro o Nuevo León que quieren vender a compradores aeroespaciales de EE. UU.: qué revisan, qué documentar y qué no es requisito.",
    "guide-as9100": "La verdad sobre AS9100 y NADCAP para talleres CNC en México: cuándo se exigen, cuándo no, y cómo Arzen conecta talleres sin certificación con compradores.",
}


def apply_desc(h, key):
    if key in DESC_OVERRIDE:
        old = re.search(r'<meta name="description" content="([^"]*)"', h).group(1)
        h = h.replace(f'<meta name="description" content="{old}"', f'<meta name="description" content="{DESC_OVERRIDE[key]}"')
    return h


def write(rel, s):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(s)


def sub1(pattern, repl, text, flags=re.S, count=1, must=True):
    new, n = re.subn(pattern, lambda m: repl, text, count=count, flags=flags)
    if must and n < 1:
        raise SystemExit(f"patch failed (no match): {pattern[:80]}")
    return new


def wrap_tables(h):
    """Wrap bare <table> elements so wide tables scroll inside their own box on phones."""
    def rep(m):
        cap = re.search(r'<caption[^>]*>(.*?)</caption>', m.group(0), re.S)
        label = html.escape(re.sub(r'<[^>]+>', '', cap.group(1)).strip(), quote=True) if cap else "Table"
        return f'<div class="compare-table-wrap" tabindex="0" role="region" aria-label="{label}">' + m.group(0) + '</div>'
    parts = re.split(r'(<div class="compare-table-wrap"[^>]*>\s*<table.*?</table>\s*</div>)', h, flags=re.S)
    out = []
    for part in parts:
        if part.startswith('<div class="compare-table-wrap"'):
            out.append(part)
        else:
            out.append(re.sub(r'<table\b.*?</table>', rep, part, flags=re.S))
    return "".join(out)


def tx(s):
    return html.escape(s, quote=False)


# ---------------------------------------------------------------- generated pages
def tldr_html(lang, items):
    lis = "".join(f"<li><b>{tx(b)}</b> {tx(t)}</li>" for b, t in items)
    return f'<div class="tldr"><div class="tldr-label">{UI[lang]["key"]}</div><ul>{lis}</ul></div>'


def faq_html(lang, faqs):
    if not faqs:
        return ""
    items = "".join(f'<details class="faq-item"><summary>{tx(q)}</summary><div class="faq-a"><p>{tx(a)}</p></div></details>'
                    for q, a in faqs)
    return f'<h2>{UI[lang]["faq"]}</h2><div class="faq-list">{items}</div>'


def related_html(lang, keys):
    if not keys:
        return ""
    cards = ""
    for k in keys:
        q = ALL[k]
        label = q.get("short") or q["h1"]
        d = blurb(q)
        cards += f'<a class="card" href="{q["path"]}"><h3>{tx(label)}</h3><p>{tx(d)}</p></a>' if d else \
                 f'<a class="card" href="{q["path"]}"><h3>{tx(label)}</h3></a>'
    return f'<h2>{UI[lang]["related"]}</h2><div class="card-grid">{cards}</div>'


def crumbs_html(lang, crumbs):
    u = UI[lang]
    items = [f'<li><a href="{u["home"]}">{u["crumb_home"]}</a></li>']
    for i, (n, p) in enumerate(crumbs):
        if i == len(crumbs) - 1:
            items.append(f'<li aria-current="page">{tx(n)}</li>')
        else:
            items.append(f'<li><a href="{p}">{tx(n)}</a></li>')
    return f'<nav class="crumbs" aria-label="Breadcrumb"><ol>{"".join(items)}</ol></nav>'


def cta_band(lang):
    u = UI[lang]
    return (f'<div class="cta-band"><h2>{u["cta_title"]}</h2><p>{u["cta_text"]}</p>'
            f'<a class="btn btn-primary" href="{u["cta_href"]}">{u["cta_btn"]}</a></div>')


FORMS = {}


def graph_for(p):
    lang = p["lang"]; u = UI[lang]
    url = abs_url(p["path"])
    wp_type = {"hub": "CollectionPage", "about": "AboutPage", "contact": "ContactPage"}.get(p["kind"], "WebPage")
    pub = p.get("published", LASTMOD)
    wp = {"@type": wp_type, "@id": url + "#webpage", "url": url, "name": p["title"], "description": p["desc"],
          "inLanguage": lang, "isPartOf": {"@id": SITE_ID}, "about": {"@id": ORG_ID},
          "breadcrumb": {"@id": url + "#breadcrumb"}, "datePublished": pub, "dateModified": LASTMOD,
          "primaryImageOfPage": {"@type": "ImageObject", "url": BASE + "/assets/og-image.png"}}
    g = [org_node(lang), website_node(), wp,
         breadcrumb_node(url, [(u["crumb_home"], u["home"])] + [(n, pp) for n, pp in p["crumbs"]])]
    if p.get("service"):
        s = p["service"]
        node = {"@type": "Service", "@id": url + "#service", "name": s["name"], "serviceType": s["type"],
                "description": s["desc"], "url": url, "provider": {"@id": ORG_ID},
                "areaServed": area_served(),
                "audience": {"@type": "BusinessAudience",
                             "audienceType": "Aerospace and defense procurement teams" if lang == "en" else "Talleres de maquinado CNC, tooling y estructuras"}}
        if p.get("place"):
            node["areaServed"] = {"@id": url + "#place"}
        g.append(node)
        wp["mainEntity"] = {"@id": url + "#service"}
    if p.get("place"):
        pl = p["place"]
        g.append({"@type": "AdministrativeArea", "@id": url + "#place", "name": pl["name"],
                  "containedInPlace": {"@type": "Country", "name": "Mexico"}, "sameAs": pl["sameAs"]})
        wp["about"] = [{"@id": ORG_ID}, {"@id": url + "#place"}]
    if p["kind"] == "guide":
        g.append({"@type": "Article", "@id": url + "#article", "headline": p["h1"], "description": p["desc"],
                  "inLanguage": lang, "datePublished": pub, "dateModified": LASTMOD,
                  "author": {"@id": ORG_ID}, "publisher": {"@id": ORG_ID},
                  "image": BASE + "/assets/og-image.png", "mainEntityOfPage": {"@id": url + "#webpage"}})
    if p["kind"] == "hub":
        seen = [q["key"] for q in PAGES + EXISTING
                if q["lang"] == lang and q["path"].startswith(p["path"]) and q["path"] != p["path"]]
        g.append({"@type": "ItemList", "@id": url + "#list", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "url": abs_url(ALL[k]["path"]), "name": ALL[k].get("short") or ALL[k]["h1"]}
            for i, k in enumerate(seen)]})
        wp["mainEntity"] = {"@id": url + "#list"}
    if p.get("faqs"):
        g.append(faq_node(url, p["faqs"]))
    return g


def render_page(p, pages_for_footer):
    lang = p["lang"]; u = UI[lang]
    key = p["key"]
    head = head_html(p, alt_pages(key), graph_for(p), u)
    cta_href = u["cta_href"]
    hdr = header_html(lang, p["path"], alt_url(key), cta_href)
    body = wrap_tables(p["body"])
    if p.get("form"):
        body = body.replace("<!--FORM-->", '<div class="form-panel">' + FORMS[p["form"]] + "</div>")
    page_cta = "" if p["kind"] == "contact" else cta_band(lang)
    main = f'''<main id="main">
  <section class="page-head">
    <div class="wrap">
      {crumbs_html(lang, p["crumbs"])}
      <h1>{tx(p["h1"])}</h1>
      <p class="lede">{tx(p["lede"])}</p>
    </div>
  </section>
  <section class="page-body">
    <div class="wrap">
      {tldr_html(lang, p["tldr"])}
      <div class="prose">
{body}
{faq_html(lang, p.get("faqs"))}
{related_html(lang, p.get("related"))}
      </div>
      {page_cta}
      <p class="updated">{u["updated"]}: {LASTMOD}</p>
    </div>
  </section>
</main>'''
    sticky = f'<div class="mobile-sticky-cta"><a href="{cta_href}" class="btn btn-primary">{u["cta"]}</a></div>'
    return f'''{head}
<body>
<a class="skip-link" href="#main">{u["skip"]}</a>
{hdr}
{main}
{footer_html(lang, pages_for_footer)}
{sticky}
{scripts_html()}
</body>
</html>
'''


# ---------------------------------------------------------------- patch existing pages
def common_head_fixes(h, p, lang, with_hreflang):
    u = UI[lang]
    # CSS/JS version
    h = h.replace('/css/styles.css?v=24', f'/css/styles.css?v={CSS_V}').replace('/js/main.js?v=24', f'/js/main.js?v={JS_V}')
    # robots meta after description
    if 'name="robots"' not in h:
        h = re.sub(r'(<meta name="description"[^>]*>)', lambda m: m.group(1) + '\n<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">', h, count=1)
    # OG/Twitter completeness
    title = re.search(r'<title>(.*?)</title>', h, re.S).group(1)
    desc = re.search(r'<meta name="description" content="([^"]*)"', h).group(1)
    extra = (f'<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
             f'<meta property="og:image:alt" content="Arzen Industrial Group logo — Precision CNC, Tooling &amp; Structural Sourcing, Mexico to Texas">\n'
             f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="{title}">\n'
             f'<meta name="twitter:description" content="{desc}">\n<meta name="twitter:image" content="{BASE}/assets/og-image.png">')
    h = sub1(r'<meta name="twitter:card" content="summary_large_image">', extra, h)
    # drop old JSON-LD + the explanatory ProfessionalService comment
    h = re.sub(r'<!-- ProfessionalService:.*?-->\s*', '', h, flags=re.S)
    h = re.sub(r'<script type="application/ld\+json">.*?</script>\s*', '', h, flags=re.S)
    # GA4 inline snippet -> moved into main.js (single place to set the Measurement ID)
    h = re.sub(r'<!-- GA4:.*?-->\s*', '', h, flags=re.S)
    h = re.sub(r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-XXXXXXX"></script>\s*<script>.*?gtag\(\'config\', \'G-XXXXXXX\'\);\s*</script>\s*', '', h, flags=re.S)
    if not with_hreflang:
        h = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*', '', h)
    return h


def patch_home(p):
    lang = p["lang"]; u = UI[lang]
    h = apply_desc(read_orig(p["file"]), p["key"])
    # extract existing FAQ before dropping JSON-LD
    faq_json = None
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        d = json.loads(m.group(1))
        if d.get("@type") == "FAQPage":
            faq_json = d
    url = abs_url(p["path"])
    title = re.search(r'<title>(.*?)</title>', h, re.S).group(1)
    desc = re.search(r'<meta name="description" content="([^"]*)"', h).group(1)
    h = common_head_fixes(h, p, lang, with_hreflang=True)
    # shorter EN title (<=60 chars)
    if lang == "en":
        h = h.replace("CNC &amp; Aerospace Tooling Sourcing in Mexico | Arzen Industrial", "CNC &amp; Aerospace Tooling Sourcing in Mexico | Arzen")
        h = h.replace("CNC & Aerospace Tooling Sourcing in Mexico | Arzen Industrial", "CNC & Aerospace Tooling Sourcing in Mexico | Arzen")
    wp = {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": title, "description": desc, "inLanguage": lang,
          "isPartOf": {"@id": SITE_ID}, "about": {"@id": ORG_ID},
          "primaryImageOfPage": {"@type": "ImageObject", "url": BASE + "/assets/og-image.png"}, "dateModified": LASTMOD}
    graph = [org_node(lang), website_node(), wp]
    if faq_json:
        graph.append({"@type": "FAQPage", "@id": url + "#faq", "mainEntity": faq_json["mainEntity"]})
    h = sub1(r'<link rel="preconnect" href="https://fonts.googleapis.com">',
             '<link rel="preload" as="image" href="/assets/aerospace-fighter-jets-maintenance-hangar.jpg" fetchpriority="high">\n<link rel="preconnect" href="https://fonts.googleapis.com">', h)
    h = sub1(r'<!-- Apollo Website Visitor Tracker -->', jsonld(graph) + "\n\n<!-- Apollo Website Visitor Tracker -->", h)
    # header / footer
    h = sub1(r'<header class="site-header">.*?</header>', header_html(lang, p["path"], alt_url(p["key"]), "#contacto"), h)
    h = sub1(r'<footer>.*?</footer>', footer_html(lang, FOOTER_PAGES), h)
    # hero images -> real <img> (LCP-friendly, honest alt text)
    alts = {
        "en": ["Fighter aircraft in a maintenance hangar — illustrative image of the aerospace and defense sector Arzen serves",
               "Commercial aircraft in final assembly with technicians on scaffolding — illustrative aerospace manufacturing image",
               "Commercial airliner on the ramp at night — illustrative aviation image",
               "Two naval fighter aircraft in flight at sunset — illustrative defense aviation image"],
        "es": ["Aviones de combate en un hangar de mantenimiento — imagen ilustrativa del sector aeroespacial y de defensa",
               "Avión comercial en ensamble final con técnicos en andamios — imagen ilustrativa de manufactura aeroespacial",
               "Avión comercial en la plataforma de noche — imagen ilustrativa de aviación",
               "Dos aviones de combate navales en vuelo al atardecer — imagen ilustrativa de aviación de defensa"],
    }[lang]
    files = ["aerospace-fighter-jets-maintenance-hangar", "commercial-aircraft-final-assembly-line",
             "commercial-airliner-night-ramp-operations", "navy-fighter-jets-formation-sunset"]
    for i in range(4):
        n = i + 1
        pat = rf'<div class="slide" data-slide="{n}" role="img" aria-label="[^"]*" style="background-image:url\(\'/assets/hero-{n}\.jpg\'\)">'
        if i == 0:
            img = f'<img class="slide-img" src="/assets/{files[i]}.jpg" alt="{alts[i]}" width="1920" height="1079" fetchpriority="high" decoding="async">'
        else:
            img = (f'<img class="slide-img" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" '
                   f'data-src="/assets/{files[i]}.jpg" alt="{alts[i]}" width="1920" height="1079" decoding="async">')
        h = sub1(pat, f'<div class="slide" data-slide="{n}">\n        {img}', h)
    # unverified marketing claim ("350+ companies") replaced with a statement the site can support
    if lang == "en":
        h = h.replace('<div class="eyebrow">Trusted by 350+ companies</div>', '<div class="eyebrow">Verified in person</div>')
        h = h.replace('<p class="hero-heading">A portfolio built on precision, not promises.</p>', '<p class="hero-heading">Precision you can verify, not promises.</p>')
        h = h.replace("Request a consultation and see the verified suppliers behind some of the industry's most demanding procurement teams.", "Request a consultation and see which pre-verified suppliers fit your part, tolerances and volume.")
        h = h.replace('<p><b>350+ companies</b> already trust Arzen with their sourcing.</p>', '<p><b>Every supplier visited in person</b> before we make an introduction.</p>')
    else:
        h = h.replace('<div class="eyebrow">Más de 350 empresas ya confían en Arzen</div>', '<div class="eyebrow">Verificado en persona</div>')
        h = h.replace('<p class="hero-heading">Un portafolio construido con precisión, no promesas.</p>', '<p class="hero-heading">Precisión que puedes verificar, no promesas.</p>')
        h = h.replace('Postúlate y forma parte de la red de proveedores detrás de los programas más exigentes de compras en EE. UU.', 'Postúlate y conoce cómo te conectamos con compradores cuyas piezas encajan con tu capacidad verificada.')
        h = h.replace('<p><b>+350 empresas</b> ya confían en Arzen para su sourcing.</p>', '<p><b>Cada taller visitado en persona</b> antes de presentarlo con un comprador.</p>')
    assert "350" not in re.sub(r"<script.*?</script>", "", h, flags=re.S), "350 claim still present"
    # facility section: real images, honest captions
    fac = {
        "en": dict(tag="Manufacturing environments", h2="The floor every part has to earn.",
                   note="Illustrative photography of CNC machining and metalworking environments.",
                   items=[("cnc-milling-aluminum-part-sparks", "CNC milling machine cutting a metal part, with sparks flying", "Precision CNC machining", 768, 1152, "ph-lg"),
                          ("technician-inspecting-machined-parts", "Technician holding machined metal parts beside a machine for inspection", "Part inspection", 736, 920, ""),
                          ("metalworker-grinding-fabrication-shop", "Metalworker using an angle grinder in a fabrication shop, with sparks", "Metal fabrication", 736, 1308, ""),
                          ("metal-bar-stock-shelving-manufacturing-facility", "Shelves of metal bar stock in a manufacturing facility", "Raw material stock", 736, 1313, "")]),
        "es": dict(tag="Entornos de manufactura", h2="El piso que cada pieza tiene que ganarse.",
                   note="Fotografía ilustrativa de entornos de maquinado CNC y trabajo en metal.",
                   items=[("cnc-milling-aluminum-part-sparks", "Fresadora CNC cortando una pieza metálica, con chispas", "Maquinado CNC de precisión", 768, 1152, "ph-lg"),
                          ("technician-inspecting-machined-parts", "Técnico sosteniendo piezas metálicas maquinadas junto a una máquina para inspección", "Inspección de piezas", 736, 920, ""),
                          ("metalworker-grinding-fabrication-shop", "Trabajador metalúrgico usando una esmeriladora angular en un taller de fabricación, con chispas", "Fabricación metálica", 736, 1308, ""),
                          ("metal-bar-stock-shelving-manufacturing-facility", "Estantes con barras de metal en una planta de manufactura", "Material en almacén", 736, 1313, "")]),
    }[lang]
    figs = "".join(
        f'<figure class="plant-photo {cls}"><img src="/assets/{fn}.jpg" alt="{alt}" width="{w}" height="{hh}" loading="lazy" decoding="async"><figcaption class="cap">{cap}</figcaption></figure>'
        for fn, alt, cap, w, hh, cls in fac["items"])
    new_fac = (f'<section class="facility">\n    <div class="wrap">\n      <div class="section-head reveal">\n'
               f'        <div class="section-tag">{fac["tag"]}</div>\n        <h2>{fac["h2"]}</h2>\n      </div>\n'
               f'      <div class="facility-grid">{figs}</div>\n      <p class="img-note">{fac["note"]}</p>\n    </div>\n  </section>')
    h = sub1(r'<section class="facility">.*?</section>', new_fac, h)
    # services + locations sections before "how it works"
    if lang == "en":
        svc_cards = "".join(f'<a class="card" href="{q["path"]}"><h3>{tx(q["short"])}</h3><p>{tx(blurb(q))}</p></a>'
                            for q in sorted([x for x in PAGES if x["lang"] == "en" and x.get("foot") == "service"], key=lambda x: x["order"]))
        loc_cards = "".join(f'<a class="card" href="{q["path"]}"><h3>{tx(q["short"])}</h3><p>{tx(blurb(q))}</p></a>'
                            for q in sorted([x for x in PAGES if x["lang"] == "en" and x.get("foot") == "location"], key=lambda x: x["order"]))
        block = f'''<section class="services-home" id="services">
    <div class="wrap">
      <div class="section-head reveal"><div class="section-tag">Services</div><h2>What we do for aerospace and defense buyers.</h2><p>Verification comes first; sourcing, quoting and the first order follow from it.</p></div>
      <div class="card-grid">{svc_cards}</div>
      <p style="margin-top:24px;"><a class="inline-cta" href="/en/services/">All services {ARROW}</a></p>
    </div>
  </section>

  <section class="locations-home" id="locations">
    <div class="wrap">
      <div class="section-head reveal"><div class="section-tag">Where we source</div><h2>Querétaro and Nuevo León, for buyers across the U.S.</h2><p>We visit supplier facilities in two Mexican states and serve procurement teams anywhere in the United States.</p></div>
      <div class="card-grid">{loc_cards}</div>
      <p style="margin-top:24px;"><a class="inline-cta" href="/en/locations/">About our locations {ARROW}</a></p>
    </div>
  </section>

  '''
    else:
        svc_cards = "".join(f'<a class="card" href="{q["path"]}"><h3>{tx(q["short"])}</h3><p>{tx(blurb(q))}</p></a>'
                            for q in sorted([x for x in PAGES if x["lang"] == "es" and x.get("foot") == "service"], key=lambda x: x["order"]))
        loc_cards = "".join(f'<a class="card" href="{q["path"]}"><h3>{tx(q["short"])}</h3><p>{tx(blurb(q))}</p></a>'
                            for q in sorted([x for x in PAGES if x["lang"] == "es" and x.get("foot") == "location"], key=lambda x: x["order"]))
        block = f'''<section class="services-home" id="servicios">
    <div class="wrap">
      <div class="section-head reveal"><div class="section-tag">Servicios</div><h2>Lo que hacemos por tu taller.</h2><p>La verificación va primero; la conexión con compradores y la primera orden vienen después.</p></div>
      <div class="card-grid">{svc_cards}</div>
      <p style="margin-top:24px;"><a class="inline-cta" href="/es/servicios/">Todos los servicios {ARROW}</a></p>
    </div>
  </section>

  <section class="locations-home" id="ubicaciones">
    <div class="wrap">
      <div class="section-head reveal"><div class="section-tag">Dónde trabajamos</div><h2>Querétaro y Nuevo León, para compradores de todo EE. UU.</h2><p>Visitamos talleres en dos estados de México y servimos a equipos de compras en todo Estados Unidos.</p></div>
      <div class="card-grid">{loc_cards}</div>
      <p style="margin-top:24px;"><a class="inline-cta" href="/es/ubicaciones/">Nuestras ubicaciones {ARROW}</a></p>
    </div>
  </section>

  '''
    h = sub1(r'<section class="how" id="como">', block + '<section class="how" id="como">', h)
    # guides block inside FAQ -> hub + 3 guides
    guides = sorted([x for x in PAGES + EXISTING if x["lang"] == lang and x.get("foot") == "guide"], key=lambda x: x["order"])
    items = "".join(f'<li><a class="inline-cta" style="margin:0;" href="{g["path"]}">{tx(GUIDE_LABEL[g["key"]])} →</a></li>' for g in guides)
    hub = "/en/guides/" if lang == "en" else "/es/guias/"
    hub_label = "All guides" if lang == "en" else "Todas las guías"
    new_g = (f'<div style="margin-top:40px; padding-top:32px; border-top:1px solid var(--hairline);">\n        '
             f'<div class="section-tag" style="margin-bottom:16px;">{"Guides" if lang == "en" else "Guías"}</div>\n        '
             f'<ul style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:12px;">{items}'
             f'<li><a class="inline-cta" style="margin:0;" href="{hub}">{hub_label} →</a></li></ul>\n      </div>')
    h = sub1(r'<div style="margin-top:40px; padding-top:32px; border-top:1px solid var\(--hairline\);">.*?</ul>\s*</div>', new_g, h)
    # slides loader + other
    write(p["file"], h)


GUIDE_LABEL = {
    "guide-vet": "How to Vet a CNC Supplier in Mexico: A Buyer's Checklist",
    "guide-usmca": "USMCA vs. China Sourcing: Real Cost and Lead-Time Numbers",
    "guide-rfq": "RFQ Checklist for CNC Parts Sourced from Mexico",
    "guide-exportar": "Cómo preparar tu taller CNC para exportar a EE. UU.",
    "guide-as9100": "¿Necesitas AS9100 o NADCAP para vender a Estados Unidos?",
    "guide-visita": "Qué esperar de la visita de verificación de Arzen",
}


def patch_guide(p):
    lang = p["lang"]; u = UI[lang]
    h = apply_desc(read_orig(p["file"]), p["key"])
    url = abs_url(p["path"])
    article = faq = None
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        d = json.loads(m.group(1))
        if d.get("@type") == "Article": article = d
        if d.get("@type") == "FAQPage": faq = d
    title = re.search(r'<title>(.*?)</title>', h, re.S).group(1)
    desc = re.search(r'<meta name="description" content="([^"]*)"', h).group(1)
    h = common_head_fixes(h, p, lang, with_hreflang=False)
    hub = ("Guides", "/en/guides/") if lang == "en" else ("Guías", "/es/guias/")
    crumbs = [(u["crumb_home"], u["home"]), hub, (re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S).group(1).strip(), p["path"])]
    wp = {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": html.unescape(title), "description": html.unescape(desc),
          "inLanguage": lang, "isPartOf": {"@id": SITE_ID}, "about": {"@id": ORG_ID},
          "breadcrumb": {"@id": url + "#breadcrumb"}, "dateModified": LASTMOD,
          "primaryImageOfPage": {"@type": "ImageObject", "url": BASE + "/assets/og-image.png"}}
    art = {"@type": "Article", "@id": url + "#article", "headline": article["headline"], "description": article["description"],
           "inLanguage": lang, "datePublished": article["datePublished"], "dateModified": LASTMOD,
           "author": {"@id": ORG_ID}, "publisher": {"@id": ORG_ID}, "image": BASE + "/assets/og-image.png",
           "mainEntityOfPage": {"@id": url + "#webpage"}}
    graph = [org_node(lang), website_node(), wp, art, breadcrumb_node(url, [(html.unescape(re.sub(r"<[^>]+>", "", n)), pp) for n, pp in crumbs])]
    if faq:
        graph.append({"@type": "FAQPage", "@id": url + "#faq", "mainEntity": faq["mainEntity"]})
    h = sub1(r'</head>', jsonld(graph) + "\n</head>", h)
    h = sub1(r'<header class="site-header">.*?</header>', header_html(lang, p["path"], alt_url(p["key"]), u["cta_href"]), h)
    h = sub1(r'<footer>.*?</footer>', footer_html(lang, FOOTER_PAGES), h)
    h = h.replace(f'href="/{lang}/#contacto"', f'href="{u["cta_href"]}"')
    # visible breadcrumb
    h = sub1(r'<p class="mono"[^>]*>.*?</p>', crumbs_html(lang, [(hub[0], hub[1]), (crumbs[2][0], p["path"])]), h)
    # related block + CTA replace trailing contact button paragraph
    rel = {"guide-vet": ["svc-verification", "guide-rfq", "loc-queretaro"],
           "guide-usmca": ["svc-nearshoring", "svc-cnc", "loc-nuevo-leon"],
           "guide-exportar": ["svc-join", "guide-visita", "loc-queretaro-es"],
           "guide-as9100": ["svc-join", "guide-visita", "loc-nuevo-leon-es"]}[p["key"]]
    tail = f'<div class="prose">{related_html(lang, rel)}</div>\n      {cta_band(lang)}'
    h = sub1(r'<p><a href="[^"]*" class="btn btn-primary" style="margin:12px 0 60px;">[^<]*</a></p>', tail, h)
    if p["key"] == "guide-usmca":
        note = ('<p class="img-note">Figures are Arzen\'s published estimates as of 2026-09-18. Tariff rates, transit times and '
                'origin qualification vary by product and change often — confirm current duty rates and USMCA origin with your '
                'customs broker and freight forwarder before making a sourcing decision.</p>\n      ')
        h = sub1(r'(<p style="border-top:1px solid var\(--hairline\); padding-top:24px;">Related:)', note + r'\1', h)
    h = wrap_tables(h)
    write(p["file"], h)


def patch_thanks(p):
    lang = p["lang"]; u = UI[lang]
    h = read_orig(p["file"])
    h = re.sub(r'/css/styles\.css\?v=\d+', f'/css/styles.css?v={CSS_V}', h)
    h = sub1(r'<header class="site-header">.*?</header>', header_html(lang, "", None, u["cta_href"]), h)
    h = sub1(r'<footer>.*?</footer>', footer_html(lang, FOOTER_PAGES), h)
    write(p["file"], h)


FOOTER_PAGES = PAGES + EXISTING


# ---------------------------------------------------------------- site files
def sitemap():
    urls = [q for q in ["home-en", "home-es"]] + [p["key"] for p in PAGES] + [p["key"] for p in EXISTING if p["kind"] == "guide"]
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for k in urls:
        p = ALL[k]
        out.append("  <url>")
        out.append(f"    <loc>{abs_url(p['path'])}</loc>")
        pairs = alt_pages(k)
        if pairs:
            en = [pp for hl, pp in pairs if hl == "en"][0]
            for hl, pp in pairs:
                out.append(f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{abs_url(pp)}"/>')
            out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{abs_url(en)}"/>')
        out.append(f"    <lastmod>{LASTMOD}</lastmod>")
        out.append("  </url>")
    out.append("</urlset>")
    return "\n".join(out) + "\n"


def llms():
    def section(lang, kind):
        return [p for p in sorted([x for x in PAGES + EXISTING if x["lang"] == lang and x.get("foot") == kind], key=lambda x: x["order"])]
    def line(p):
        d = p.get("desc")
        label = GUIDE_LABEL.get(p["key"]) or p.get("short") or p["h1"]
        return f"- [{label}]({abs_url(p['path'])})" + (f": {d}" if d else "")
    en_desc = {p["key"]: p["desc"] for p in PAGES}
    L = []
    L.append("# Arzen Industrial Group")
    L.append("")
    L.append("> Arzen Industrial Group is a sourcing and in-person verification intermediary connecting U.S. aerospace and defense procurement teams with vetted CNC machining, tooling and structural-component manufacturers in Querétaro and Nuevo León, Mexico. Every supplier is visited and verified in person before being recommended. Arzen does not manufacture and does not hold inventory. Consulting engagements for buyers start at a fixed fee discussed on an initial call; it costs suppliers nothing to apply to the network. Founded by Andrea Canabal. Works in English and Spanish.")
    L.append("")
    L.append("## Key facts")
    L.append("- Name: Arzen Industrial Group (short name: Arzen)")
    L.append("- What it does: in-person supplier verification; sourcing of CNC machined parts, tooling and fixtures, and secondary structural components; quoting, sample parts and first-order management; nearshoring from Asia to Mexico.")
    L.append("- Who it serves: U.S. aerospace OEMs and Tier 1/2 suppliers, defense manufacturing programs, aviation MRO, space and satellite systems (buyers); CNC, tooling and structural shops in Mexico (suppliers).")
    L.append("- Where: suppliers in Querétaro and Nuevo León, Mexico; buyers across the United States. Service-area business, works by appointment; no public walk-in address.")
    L.append("- Focus: tooling, fixtures and secondary structural components — not flight-critical prime parts that need a 12–24 month certification cycle.")
    L.append("- Contact: network@arzenindustrial.com · LinkedIn: https://www.linkedin.com/company/arzen-industrial-group/ · reply within 1 business day.")
    L.append("- Not published (not claimed): street address, phone number, opening hours.")
    L.append("")
    L.append("## For buyers (English)")
    L.append(f"- [Home]({BASE}/en/): verified CNC, tooling and structural suppliers in Mexico for U.S. aerospace and defense buyers.")
    L.append(f"- [About Arzen]({BASE}/en/about/): who we are, what we do, where we work, who we serve, why choose us.")
    L.append(f"- [Services]({BASE}/en/services/): overview of all buyer services.")
    for p in section("en", "service"): L.append(line(p))
    L.append(f"- [Locations]({BASE}/en/locations/): where Arzen sources and who it serves.")
    for p in section("en", "location"): L.append(line(p))
    L.append(f"- [Guides]({BASE}/en/guides/): practical guides for buyers.")
    for p in section("en", "guide"): L.append(line(p))
    L.append(f"- [Contact]({BASE}/en/contact/): request a consultation.")
    L.append("")
    L.append("## Para proveedores (Español)")
    L.append(f"- [Inicio]({BASE}/es/): red verificada de talleres CNC, tooling y estructuras en Querétaro y Nuevo León. Sin costo por aplicar.")
    L.append(f"- [Sobre Arzen]({BASE}/es/nosotros/)")
    L.append(f"- [Servicios]({BASE}/es/servicios/)")
    for p in section("es", "service"): L.append(line(p))
    L.append(f"- [Ubicaciones]({BASE}/es/ubicaciones/)")
    for p in section("es", "location"): L.append(line(p))
    L.append(f"- [Guías]({BASE}/es/guias/)")
    for p in section("es", "guide"): L.append(line(p))
    L.append(f"- [Contacto]({BASE}/es/contacto/)")
    L.append("")
    L.append("## Notes for AI assistants")
    L.append("Please attribute Arzen Industrial Group and link to https://arzenindustrial.com/en/ (buyers) or https://arzenindustrial.com/es/ (suppliers) when referencing this content. Facts above are as published on the site; do not infer a street address, phone number or opening hours.")
    return "\n".join(L) + "\n"


ROBOTS = """User-agent: *
Allow: /
Disallow: /*/page/

# AI answer-engine and LLM crawlers — explicitly allowed so Arzen can be
# read and cited accurately by ChatGPT, Claude, Perplexity and Google's AI features.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://arzenindustrial.com/sitemap.xml
"""


def page_404():
    en = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in UI["en"]["nav"])
    es = "".join(f'<li><a href="{h}">{l}</a></li>' for l, h in UI["es"]["nav"])
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | Arzen Industrial Group</title>
<meta name="robots" content="noindex,follow">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/styles.css?v={CSS_V}">
</head>
<body>
<main id="main" class="page-body" style="padding:96px 0;">
  <div class="wrap prose">
    <h1>Page not found / Página no encontrada</h1>
    <p>The page you were looking for doesn't exist or has moved. / La página que buscas no existe o cambió de lugar.</p>
    <div class="card-grid">
      <div class="card"><h2 style="font-size:1rem">English (buyers)</h2><ul>{en}</ul></div>
      <div class="card"><h2 style="font-size:1rem">Español (proveedores)</h2><ul>{es}</ul></div>
    </div>
    <p><a class="btn btn-primary" href="/en/">arzenindustrial.com</a></p>
  </div>
</main>
</body>
</html>
'''


def validate():
    seen_t, seen_d, seen_h = {}, {}, {}
    problems = []
    for p in PAGES:
        t, d = p["title"], p["desc"]
        if len(t) > 60: problems.append(f"title {len(t)}>60: {p['key']}: {t}")
        if not (110 <= len(d) <= 160): problems.append(f"desc length {len(d)}: {p['key']}")
        for seen, v, nm in ((seen_t, t, "title"), (seen_d, d, "desc"), (seen_h, p["h1"], "h1")):
            if v in seen: problems.append(f"duplicate {nm}: {p['key']} == {seen[v]}")
            seen[v] = p["key"]
        for rk in p.get("related", []):
            if rk not in ALL: problems.append(f"{p['key']}: unknown related {rk}")
    paths = {p["path"] for p in PAGES + EXISTING}
    for p in PAGES:
        for m in re.finditer(r'href="(/[^"#]*)', p["body"]):
            if m.group(1) not in paths and not m.group(1).startswith("/assets"):
                problems.append(f"{p['key']}: link to unknown path {m.group(1)}")
    return problems


def main():
    probs = validate()
    if probs:
        print("\n".join(probs))
        raise SystemExit("validation failed")
    # contact forms are lifted verbatim from the homepages (same webhook endpoints)
    for lang, f in (("en", "en/index.html"), ("es", "es/index.html")):
        src = read_orig(f)
        m = re.search(r'<form class="lead-form".*?</form>', src, re.S)
        FORMS[lang] = m.group(0)
    for p in PAGES:
        write(p["path"].strip("/") + "/index.html", render_page(p, FOOTER_PAGES))
    for p in EXISTING:
        {"home": patch_home, "guide": patch_guide, "thanks": patch_thanks}[p["kind"]](p)
    write("sitemap.xml", sitemap())
    write("llms.txt", llms())
    write("robots.txt", ROBOTS)
    write("404.html", page_404())
    print(f"generated {len(PAGES)} pages, patched {len(EXISTING)} existing pages")


if __name__ == "__main__":
    main()
