#!/usr/bin/env python3
"""Static audit of the built site (run from repo root after build.py).
Checks links, metadata, headings, canonicals, hreflang reciprocity, JSON-LD validity and
@id references, duplicate titles/descriptions/H1s, thin content, orphan pages and click depth."""
import json, os, re, sys
from html.parser import HTMLParser
from collections import defaultdict, deque

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BASE = "https://arzenindustrial.com"
SKIP = {"okzlbraclxqf73x0oqnbxhraenqbbd.html"}


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""; self.in_title = False; self.meta = {}; self.links = []; self.hrefs = []; self.heads = []
        self.cur_head = None; self.imgs = []; self.ld = []; self.in_ld = False; self.text = []; self.ids = set()
        self.skip_depth = 0; self.canonical = None; self.alts = []; self.anchors_ids = set()
    def handle_starttag(self, tag, a):
        a = dict(a)
        if "id" in a: self.ids.add(a["id"])
        if tag == "title": self.in_title = True
        elif tag == "meta":
            k = a.get("name") or a.get("property")
            if k: self.meta[k] = a.get("content", "")
        elif tag == "link":
            if a.get("rel") == "canonical": self.canonical = a.get("href")
            if a.get("rel") == "alternate" and a.get("hreflang"): self.alts.append((a["hreflang"], a["href"]))
        elif tag == "a" and a.get("href"): self.hrefs.append(a["href"])
        elif tag in ("h1", "h2", "h3", "h4"): self.cur_head = [tag, ""]
        elif tag == "img": self.imgs.append(a)
        elif tag == "script":
            if a.get("type") == "application/ld+json": self.in_ld = True; self.ld.append("")
            self.skip_depth += 1
        elif tag == "style": self.skip_depth += 1
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        elif tag in ("h1", "h2", "h3", "h4") and self.cur_head: self.heads.append(tuple(self.cur_head)); self.cur_head = None
        elif tag == "script": self.in_ld = False; self.skip_depth -= 1
        elif tag == "style": self.skip_depth -= 1
    def handle_data(self, d):
        if self.in_title: self.title += d
        if self.in_ld: self.ld[-1] += d
        if self.cur_head: self.cur_head[1] += d
        if not self.skip_depth: self.text.append(d)


def url_of(rel):
    u = "/" + rel.replace("index.html", "")
    return u


pages = {}
for dp, dn, fn in os.walk(ROOT):
    if any(x in dp for x in ("/.git", "/_build", "/node_modules")): continue
    for f in fn:
        if not f.endswith(".html") or f in SKIP: continue
        rel = os.path.relpath(os.path.join(dp, f), ROOT)
        if rel == "index.html": continue
        p = P(); p.feed(open(os.path.join(dp, f), encoding="utf-8").read())
        pages[url_of(rel) if f == "index.html" else "/" + rel] = (rel, p)

problems = []; notes = []
indexable = {u: v for u, v in pages.items() if "noindex" not in v[1].meta.get("robots", "") and not u.endswith("404.html")}

# --- per page checks
titles = defaultdict(list); descs = defaultdict(list); h1s = defaultdict(list)
for u, (rel, p) in indexable.items():
    t = p.title.strip(); d = p.meta.get("description", "")
    titles[t].append(u); descs[d].append(u)
    h1 = [h for h in p.heads if h[0] == "h1"]
    if len(h1) != 1: problems.append(f"{u}: {len(h1)} <h1>")
    else: h1s[h1[0][1].strip()].append(u)
    if not t or len(t) > 62: problems.append(f"{u}: title length {len(t)} ({t})")
    if not d or len(d) > 160: problems.append(f"{u}: description length {len(d)}")
    if p.canonical != BASE + u: problems.append(f"{u}: canonical {p.canonical} != self")
    if "index" not in p.meta.get("robots", ""): problems.append(f"{u}: no robots meta")
    for k in ("og:title", "og:description", "og:url", "og:image", "twitter:card", "og:locale"):
        if not p.meta.get(k): problems.append(f"{u}: missing {k}")
    if p.meta.get("og:url") != BASE + u: problems.append(f"{u}: og:url mismatch {p.meta.get('og:url')}")
    # heading order (no skipped levels)
    last = 1
    for tag, txt in p.heads:
        lvl = int(tag[1])
        if lvl > last + 1: problems.append(f"{u}: heading jump h{last}->h{lvl} ({txt.strip()[:40]})")
        last = lvl
    for im in p.imgs:
        if "alt" not in im: problems.append(f"{u}: <img> without alt {im.get('src','')[:50]}")
        if im.get("src", "").startswith("/assets") and ("width" not in im or "height" not in im): problems.append(f"{u}: img without width/height")
    words = len(re.findall(r"\w+", " ".join(p.text)))
    if words < 250 and "/guides/" not in u and "/guias/" not in u or words < 200: notes.append(f"{u}: only {words} words")
    # json-ld
    defined = set(); refs = set()
    for blob in p.ld:
        try: data = json.loads(blob)
        except Exception as e: problems.append(f"{u}: invalid JSON-LD ({e})"); continue
        nodes = data.get("@graph", [data])
        def walk(o):
            if isinstance(o, dict):
                if "@id" in o and len(o) == 1: refs.add(o["@id"])
                elif "@id" in o: defined.add(o["@id"])
                for v in o.values(): walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(nodes)
    for r in refs - defined:
        problems.append(f"{u}: JSON-LD references undefined @id {r}")
    if not p.ld: problems.append(f"{u}: no JSON-LD")

for nm, d in (("title", titles), ("description", descs), ("h1", h1s)):
    for k, v in d.items():
        if len(v) > 1: problems.append(f"duplicate {nm} on {v}: {k[:60]}")

# --- links
inbound = defaultdict(set); graph = defaultdict(set)
for u, (rel, p) in pages.items():
    for h in p.hrefs:
        if h.startswith(("mailto:", "tel:", "javascript:")): continue
        if h.startswith("http"):
            if h.startswith(BASE) : h = h[len(BASE):] or "/"
            else: continue
        path, _, frag = h.partition("#")
        if path == "": path = u
        if path.startswith("/") is False: problems.append(f"{u}: relative link {h}"); continue
        target = path
        if target in pages: ok = True
        else:
            fs = os.path.join(ROOT, target.lstrip("/"))
            ok = os.path.isfile(fs) or os.path.isfile(os.path.join(fs, "index.html"))
        if not ok: problems.append(f"{u}: broken link {h}")
        elif target in pages:
            inbound[target].add(u); graph[u].add(target)
            if frag and frag not in pages[target][1].ids: problems.append(f"{u}: anchor #{frag} not found on {target}")
        if not (target in pages or ok): continue
        if "?" in target: problems.append(f"{u}: query in link {h}")
        if target != "/" and not target.endswith("/") and "." not in os.path.basename(target) and ok:
            problems.append(f"{u}: link without trailing slash {h}")

# --- hreflang reciprocity
for u, (rel, p) in indexable.items():
    for hl, href in p.alts:
        t = href.replace(BASE, "")
        if t not in pages: problems.append(f"{u}: hreflang {hl} -> missing {t}"); continue
        back = [x for x in pages[t][1].alts if x[1] == BASE + u]
        if not back: problems.append(f"{u}: hreflang to {t} not reciprocated")
    if p.alts and BASE + u not in [h for _, h in p.alts]: problems.append(f"{u}: hreflang set lacks self-reference")

# --- sitemap
sm = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
locs = set(re.findall(r"<loc>([^<]+)</loc>", sm))
for u in indexable:
    if BASE + u not in locs: problems.append(f"{u}: indexable but not in sitemap")
for l in locs:
    if l.replace(BASE, "") not in pages: problems.append(f"sitemap lists missing page {l}")

# --- orphans & depth from /en/ and /es/
for start in ("/en/", "/es/"):
    depth = {start: 0}; q = deque([start])
    while q:
        c = q.popleft()
        for n in graph[c]:
            if n not in depth: depth[n] = depth[c] + 1; q.append(n)
    lang = start.strip("/")
    for u in indexable:
        if u.startswith("/" + lang + "/") and u not in depth: problems.append(f"{u}: orphan from {start}")
        elif u.startswith("/" + lang + "/") and depth[u] > 2: notes.append(f"{u}: click depth {depth[u]} from {start}")
for u in indexable:
    if len(inbound[u]) < 2 and u not in ("/en/", "/es/"): notes.append(f"{u}: only {len(inbound[u])} inbound internal links")

# --- misc content rules
for u, (rel, p) in pages.items():
    txt = " ".join(p.text)
    if re.search(r"350\+|\+350|350 empresas|350 companies", txt): problems.append(f"{u}: unverified '350' claim present")
for rel in ("robots.txt", "llms.txt", "sitemap.xml", "404.html"):
    if not os.path.exists(os.path.join(ROOT, rel)): problems.append(f"missing {rel}")

print(f"pages: {len(pages)} (indexable {len(indexable)}); problems: {len(problems)}; notes: {len(notes)}")
for x in problems: print("PROBLEM", x)
for x in notes: print("note   ", x)
sys.exit(1 if problems else 0)
