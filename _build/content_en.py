# English pages (buyer-facing). Facts come only from what Arzen already states publicly on its site.
# Do not add specific numbers (tariff %, transit hours, client counts) here — see the guides for those.

PAGES = []

def add(**kw):
    kw.setdefault("lang", "en")
    PAGES.append(kw)

# ---------------------------------------------------------------- SERVICES
add(key="svc-hub", kind="hub", path="/en/services/", foot=None, order=0,
    title="Sourcing & Verification Services | Arzen Industrial",
    desc="Supplier verification, CNC machining, tooling and fixtures, secondary structural parts and nearshoring from Querétaro and Nuevo León, Mexico.",
    h1="Sourcing and verification services for aerospace and defense buyers",
    short="All services",
    lede="Arzen is a sourcing and in-person verification intermediary. We don't manufacture and we don't hold inventory — we find, visit and verify Mexican CNC, tooling and structural shops, then stay involved through your first purchase order.",
    crumbs=[("Services", "/en/services/")],
    tldr=[("Who it's for:", "U.S. procurement teams in aerospace, defense, aviation MRO and space systems."),
          ("What we cover:", "supplier verification, CNC machining, tooling and fixtures, secondary structural components, nearshoring and first-order management."),
          ("Where:", "verified shops in Querétaro and Nuevo León, Mexico."),
          ("How to start:", "a short call about your part, tolerances, certifications and volume.")],
    body="""
<h2>What we do for buyers</h2>
<div class="card-grid">
  <a class="card" href="/en/services/supplier-verification/"><h3>In-person supplier verification</h3><p>We walk the shop floor, confirm equipment and tolerances against real parts, and cross-check references.</p></a>
  <a class="card" href="/en/services/cnc-machining-sourcing/"><h3>CNC machining sourcing</h3><p>Precision machined parts from verified shops in Querétaro and Nuevo León.</p></a>
  <a class="card" href="/en/services/tooling-and-fixtures-sourcing/"><h3>Tooling and fixtures sourcing</h3><p>Production, inspection and ground-support tooling from shops we've visited.</p></a>
  <a class="card" href="/en/services/structural-components-sourcing/"><h3>Secondary structural components</h3><p>Brackets, supports and structural parts that are not flight-critical primes.</p></a>
  <a class="card" href="/en/services/usmca-nearshoring-sourcing/"><h3>Nearshoring from Asia to Mexico</h3><p>Move a part from an Asian supplier to a Mexican shop, with USMCA considerations raised early.</p></a>
  <a class="card" href="/en/services/quoting-sample-first-order/"><h3>Quoting, sample and first order</h3><p>Formal quotes, a physical sample before you commit, and a managed first purchase order.</p></a>
</div>

<h2>Problems these services solve</h2>
<table class="spec-table">
  <caption>From problem to service</caption>
  <thead><tr><th scope="col">The problem</th><th scope="col">Where to start</th></tr></thead>
  <tbody>
    <tr><th scope="row">Supplier capability is self-reported and nobody has seen the shop floor</th><td><a href="/en/services/supplier-verification/">Supplier verification</a> · <a href="/en/guides/vet-cnc-supplier-mexico/">Guide: how to vet a CNC supplier</a></td></tr>
    <tr><th scope="row">Tariff exposure and long sea freight on parts sourced from Asia</th><td><a href="/en/services/usmca-nearshoring-sourcing/">Nearshoring</a> · <a href="/en/guides/usmca-vs-china-sourcing/">Guide: USMCA vs. China sourcing</a></td></tr>
    <tr><th scope="row">You need tooling or fixtures without a long supplier-qualification cycle</th><td><a href="/en/services/tooling-and-fixtures-sourcing/">Tooling and fixtures sourcing</a></td></tr>
    <tr><th scope="row">You don't know what to put in an RFQ so quotes are comparable</th><td><a href="/en/guides/rfq-checklist-cnc-parts-mexico/">Guide: RFQ checklist</a> · <a href="/en/services/quoting-sample-first-order/">Quoting and sample</a></td></tr>
    <tr><th scope="row">The first order with a new supplier is the riskiest one</th><td><a href="/en/services/quoting-sample-first-order/">First-order management</a></td></tr>
  </tbody>
</table>

<h2>Who we work with</h2>
<p>We stay deliberately narrow: <b>tooling, fixtures and secondary structural components</b> for aerospace OEMs and Tier 1/2 suppliers, defense manufacturing programs, aviation MRO, and space and satellite systems. We are not the right fit for flight-critical prime parts that require a 12–24 month certification cycle — if your part is one of those, we'll say so on the first call.</p>

<h2>Where the work happens</h2>
<p>Suppliers are located in <a href="/en/locations/queretaro/">Querétaro</a> and <a href="/en/locations/nuevo-leon/">Nuevo León</a>, Mexico. Buyers can be anywhere in the United States.</p>
""",
    related=["svc-verification", "loc-hub", "contact"], faqs=[
        ("Does Arzen manufacture parts?", "No. Arzen does not manufacture and does not hold inventory. We verify independent shops in Mexico and connect you with the ones that fit your part."),
        ("Which service should I start with?", "Most buyers start with a short call. We discuss your part, tolerances, certifications and volume, and then recommend whether verification, sourcing or a managed first order is the right next step."),
    ])

add(key="svc-verification", kind="service", path="/en/services/supplier-verification/", foot="service", order=1,
    title="In-Person CNC Supplier Verification in Mexico | Arzen",
    desc="Arzen visits CNC, tooling and structural shops in Querétaro and Nuevo León, confirms equipment, tolerances and references, then matches them to your part.",
    h1="In-person supplier verification in Mexico", short="Supplier verification",
    lede="A supplier profile can say anything. Before we introduce a shop, we visit it: we walk the floor, check the equipment list against real parts in production, confirm tolerances and capacity, and cross-reference its track record with other clients.",
    crumbs=[("Services", "/en/services/"), ("Supplier verification", "/en/services/supplier-verification/")],
    tldr=[("What it is:", "an in-person visit and documented check of a shop before it is recommended to you."),
          ("What it rules out:", "self-reported capability, staged photos and shops that can't hold your tolerance."),
          ("Where:", "Querétaro and Nuevo León, Mexico."),
          ("Cost:", "consulting engagements start at a fixed fee, discussed on the first call. Inquiring is free.")],
    service={"name": "In-person supplier verification", "type": "Supplier verification and sourcing consulting",
             "desc": "In-person verification of CNC machining, tooling and structural suppliers in Querétaro and Nuevo León, Mexico, for U.S. aerospace and defense buyers."},
    body="""
<h2>What we verify</h2>
<ul>
  <li><b>Equipment against real parts.</b> We compare the equipment list with parts actually in production, not just a brochure.</li>
  <li><b>Tolerances, capacity and volume.</b> Documented tolerances and real capacity are confirmed on site.</li>
  <li><b>Client references.</b> We validate track record with the shop's other clients, not only the references it chooses to give.</li>
  <li><b>The people.</b> We sit across the table from the owner and see how the shop responds when something goes wrong.</li>
</ul>

<h2>Problems this solves</h2>
<ul>
  <li>Marketplace and directory profiles are self-reported — no one has seen the shop floor.</li>
  <li>Engineering time is spent on shops that cannot hold the tolerance you need.</li>
  <li>The first purchase order with an unknown supplier carries the most risk.</li>
</ul>

<h2>How a verification works</h2>
<ol>
  <li><b>Intake call.</b> A short conversation about your part, tolerances, certifications and volume.</li>
  <li><b>Visit.</b> We go to the shop in person and document what we find.</li>
  <li><b>Decision.</b> Only shops that pass are introduced to you.</li>
  <li><b>Introduction.</b> You receive pre-verified shops matched to your specification, with one accountable point of contact on our side.</li>
</ol>
<p>Verification lowers your risk; it does not replace your own incoming inspection. We still recommend a physical sample part before production — see <a href="/en/services/quoting-sample-first-order/">quoting, sample and first order</a>.</p>

<h2>Information that speeds things up</h2>
<p>Have these ready for the first call: the drawing with tolerances, material, estimated monthly volume, required certifications and your timeline. Not sure what to include? Use our <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a>. For a deeper look at what a buyer should check, read <a href="/en/guides/vet-cnc-supplier-mexico/">how to vet a CNC supplier in Mexico</a>.</p>

<h2>Where we verify</h2>
<p>Shops in <a href="/en/locations/queretaro/">Querétaro</a> and <a href="/en/locations/nuevo-leon/">Nuevo León</a>.</p>
""",
    related=["guide-vet", "svc-quoting", "loc-queretaro"], faqs=[
        ("What does Arzen actually verify before recommending a supplier?", "We visit the shop floor in person, confirm the equipment list against real parts in production, check documented tolerances and capacity, and cross-reference the shop's track record with its existing clients."),
        ("Do I need to visit the shop myself?", "Not necessarily. What matters is that the visit is genuinely in person and documented. Many procurement teams use a partner who has already walked the floor, and still request a sample part."),
        ("Does verification guarantee quality?", "No. It reduces risk by confirming capability and track record before an introduction. You should still inspect a sample part and incoming lots against your drawing."),
        ("How much does verification cost?", "Consulting engagements start at a fixed fee, discussed on your initial call once we understand your part, tolerances and volume. There is no cost to submit an inquiry."),
    ])

add(key="svc-cnc", kind="service", path="/en/services/cnc-machining-sourcing/", foot="service", order=2,
    title="CNC Machining Sourcing in Mexico | Arzen Industrial",
    desc="Source precision CNC machined parts from shops in Querétaro and Nuevo León that Arzen has visited and verified, matched to aerospace and defense specs.",
    h1="CNC machining sourcing in Mexico for aerospace and defense", short="CNC machining sourcing",
    lede="Tell us the part, the tolerance and the volume. We match you with CNC shops in Querétaro and Nuevo León that we have already walked — not a database of self-reported listings.",
    crumbs=[("Services", "/en/services/"), ("CNC machining sourcing", "/en/services/cnc-machining-sourcing/")],
    tldr=[("Parts:", "machined components such as aluminum brackets or titanium fixtures, from prototype to production volume."),
          ("Focus:", "tooling, fixtures and secondary structural parts — not flight-critical primes."),
          ("Where:", "verified shops in Querétaro and Nuevo León."),
          ("Process:", "diagnosis call → matched shops → quote and sample → managed first order.")],
    service={"name": "CNC machining sourcing", "type": "Sourcing of precision CNC machined parts",
             "desc": "Sourcing of precision CNC machined parts from verified shops in Querétaro and Nuevo León, Mexico, for U.S. aerospace and defense buyers."},
    body="""
<h2>What buyers use this for</h2>
<p>Typical requests are machined brackets, plates, housings and fixtures in aluminum or titanium, and replacement parts for maintenance and overhaul operations. Inquiries range from one-off prototypes to production volumes — our consultation form lists ranges from prototype up to 5,000+ units per month.</p>

<h2>What we check before recommending a machining shop</h2>
<ul>
  <li>The machine list against parts actually in production, in a comparable material and tolerance band.</li>
  <li>How inspection is really performed and documented.</li>
  <li>Capacity and lead-time reality, confirmed on site.</li>
  <li>Track record with the shop's other clients.</li>
</ul>

<h2>Problems this solves</h2>
<ul>
  <li><b>Unverified capability:</b> a profile that claims aerospace-grade work with no one having seen the shop.</li>
  <li><b>Tariff and freight exposure</b> on parts currently sourced from Asia — see <a href="/en/services/usmca-nearshoring-sourcing/">nearshoring</a>.</li>
  <li><b>Quotes you can't compare</b> because the RFQ package was incomplete — see the <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a>.</li>
</ul>

<p><b>Export controls:</b> if your drawings or technical data are export-controlled (for example ITAR or EAR), confirm with your compliance team before sharing them with any supplier outside the United States. Arzen cannot make that determination for you.</p>
<h2>Is it a fit for your part?</h2>
<p>We stay deliberately narrow: tooling, fixtures and secondary structural components for aerospace OEMs, Tier 1/2 suppliers, defense programs, aviation MRO and space systems. If your part is flight-critical and needs a 12–24 month certification cycle, tell us on the first call and we will tell you honestly whether it fits. Tell us the certifications your program requires so we match accordingly.</p>

<h2>Where</h2>
<p>Our machining suppliers are in <a href="/en/locations/queretaro/">Querétaro</a> and <a href="/en/locations/nuevo-leon/">Nuevo León</a>.</p>
""",
    related=["svc-tooling", "svc-verification", "svc-quoting"], faqs=[
        ("Does Arzen machine the parts?", "No. Arzen is a sourcing and verification intermediary. Parts are made by independent, pre-verified shops in Mexico."),
        ("Can you source prototypes and low volumes?", "Yes. Inquiries can range from a one-off prototype to production volumes. Volume affects which shop is the best match, so we ask for it on the first call."),
        ("What tolerances can the shops hold?", "It depends on the shop and the part. We confirm documented tolerances and capacity on site, then match shops to your drawing rather than quoting a generic number."),
        ("Do the shops need AS9100 or Nadcap?", "Tell us which certifications your program requires. For flight-critical prime parts that need a long certification cycle, we may not be the right fit and will say so."),
    ])

add(key="svc-tooling", kind="service", path="/en/services/tooling-and-fixtures-sourcing/", foot="service", order=3,
    title="Tooling & Fixtures Sourcing from Mexico | Arzen",
    desc="Source production, inspection and ground-support tooling and fixtures from verified shops in Querétaro and Nuevo León for aerospace and defense programs.",
    h1="Tooling and fixtures sourcing from Mexico", short="Tooling and fixtures",
    lede="Tooling and fixtures are where nearshoring is easiest to start: they support production rather than fly. Arzen sources them from shops we have visited, so you skip the guesswork on who can actually build to your drawing.",
    crumbs=[("Services", "/en/services/"), ("Tooling and fixtures", "/en/services/tooling-and-fixtures-sourcing/")],
    tldr=[("What:", "production tooling, assembly and inspection fixtures, replacement tooling and ground-support tooling."),
          ("Why nearshore:", "no long supplier-qualification cycle for non-flight-critical items."),
          ("Where:", "Querétaro and Nuevo León."),
          ("Start:", "send the drawing and revision; we diagnose fit on a short call.")],
    service={"name": "Tooling and fixtures sourcing", "type": "Sourcing of tooling and fixtures",
             "desc": "Sourcing of production, inspection and ground-support tooling and fixtures from verified shops in Querétaro and Nuevo León, Mexico."},
    body="""
<h2>Typical tooling requests</h2>
<ul>
  <li><b>Production and assembly fixtures</b> for aerospace and defense manufacturers.</li>
  <li><b>Replacement tooling</b> for maintenance, repair and overhaul operations.</li>
  <li><b>Ground-support tooling</b> for space and satellite manufacturers.</li>
  <li><b>Inspection fixtures</b> supporting dimensional checks of finished parts.</li>
</ul>

<h2>Why tooling is a good place to start with a Mexican supplier</h2>
<p>Because tooling and fixtures are not flight-critical prime parts, you can usually avoid the 12–24 month certification cycle associated with prime components. That lets a procurement team test a new supplier relationship on lower-risk work first, with a sample part and a managed first order.</p>

<h2>What to send us</h2>
<ul>
  <li>The current drawing and revision, with tolerances and datums.</li>
  <li>Material and finish requirements.</li>
  <li>Quantity per order and expected repeat volume.</li>
  <li>Any inspection or documentation requirements.</li>
</ul>
<p>The <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a> covers the full package.</p>

<h2>Problems this solves</h2>
<ul>
  <li>Long qualification cycles for a supplier on non-critical work.</li>
  <li>Fixtures that arrive late because the shop's real capacity was never confirmed.</li>
  <li>Tariff exposure and sea-freight lead time on tooling made in Asia — see <a href="/en/guides/usmca-vs-china-sourcing/">USMCA vs. China sourcing</a>.</li>
</ul>
""",
    related=["svc-cnc", "svc-quoting", "loc-nuevo-leon"], faqs=[
        ("Do you source tooling for maintenance and overhaul?", "Yes. Replacement tooling for aviation MRO operations is one of the use cases we focus on."),
        ("Can one shop make both the fixture and the parts?", "Sometimes. Which shop is the best match depends on the equipment and capacity we confirmed on site. Tell us what you need and we'll match accordingly."),
        ("How do I start?", "Request a consultation and send the drawing, material and volume. We reply within 1 business day to schedule a short call."),
    ])

add(key="svc-structural", kind="service", path="/en/services/structural-components-sourcing/", foot="service", order=4,
    title="Secondary Structural Components Sourcing in Mexico | Arzen",
    desc="Source secondary structural components for aerospace and defense from verified shops in Querétaro and Nuevo León, without a long certification cycle.",
    h1="Secondary structural components sourcing in Mexico", short="Structural components",
    lede="Secondary structural components support or attach to primary structure but are not flight-critical primes. Arzen sources them from verified shops in Querétaro and Nuevo León and manages the first order.",
    crumbs=[("Services", "/en/services/"), ("Structural components", "/en/services/structural-components-sourcing/")],
    tldr=[("Scope:", "secondary structural components — not flight-critical primes."),
          ("Customers:", "aerospace OEM and Tier 1/2, defense programs, aviation MRO, space systems."),
          ("Where:", "Querétaro and Nuevo León."),
          ("Honest fit check:", "if your part needs a long certification cycle, we'll tell you on the first call.")],
    service={"name": "Secondary structural components sourcing", "type": "Sourcing of secondary structural components",
             "desc": "Sourcing of secondary structural components for aerospace and defense from verified shops in Querétaro and Nuevo León, Mexico."},
    body="""
<h2>What counts as secondary structural</h2>
<p>For our purposes, these are structural components that are not flight-critical primes — for example brackets, supports and ground-support structures. Your engineering and quality teams decide how a given part is classified. If you are unsure, bring the drawing to the first call and we will tell you honestly whether it fits our focus.</p>

<h2>What is outside our focus</h2>
<p>Flight-critical prime components that require a 12–24 month certification cycle are outside what we do. Saying so early saves both sides time.</p>

<h2>How sourcing works</h2>
<ol>
  <li><b>Diagnosis.</b> A short call on your part, tolerances, certifications and volume.</li>
  <li><b>Matched shops.</b> Pre-verified shops in Querétaro and Nuevo León that fit your spec.</li>
  <li><b>Quote and sample.</b> A formal quote and a physical sample part before you commit to a production run.</li>
  <li><b>First order.</b> Managed end to end so the handoff to your supply chain is clean.</li>
</ol>

<h2>Problems this solves</h2>
<ul>
  <li>Finding a shop that can hold tolerance on structural geometry without trusting a self-reported listing.</li>
  <li>Reducing tariff exposure and freight time compared with sourcing from Asia.</li>
  <li>Having one accountable point of contact through the first purchase order.</li>
</ul>
""",
    related=["svc-cnc", "svc-verification", "svc-nearshoring"], faqs=[
        ("Is this the same as primary structure?", "No. We focus on secondary structural components. Primary and flight-critical structure typically involves certification and approvals outside what we do."),
        ("What if I'm not sure my part is secondary?", "Bring the drawing to the first call. If it isn't a fit, we'll tell you and, where possible, point you somewhere better."),
    ])

add(key="svc-nearshoring", kind="service", path="/en/services/usmca-nearshoring-sourcing/", foot="service", order=5,
    title="Nearshoring Aerospace Sourcing: Asia to Mexico | Arzen",
    desc="Move CNC, tooling and structural sourcing from Asia to verified shops in Querétaro and Nuevo León, with USMCA and tariff questions raised early.",
    h1="Nearshoring aerospace sourcing from Asia to Mexico", short="Nearshoring (USMCA)",
    lede="If a part is currently made in Asia, Arzen can help you evaluate moving it to a verified Mexican shop — overland by truck instead of weeks by sea, and without China-origin tariff exposure.",
    crumbs=[("Services", "/en/services/"), ("Nearshoring", "/en/services/usmca-nearshoring-sourcing/")],
    tldr=[("What changes:", "tariff exposure, freight time and supplier visibility."),
          ("USMCA:", "preferential treatment depends on the product's rules of origin — raise it early and confirm with your customs broker."),
          ("Numbers:", "see our guide for the cost and lead-time comparison."),
          ("Where:", "Querétaro and Nuevo León.")],
    service={"name": "Nearshoring sourcing from Asia to Mexico", "type": "Nearshoring sourcing consulting",
             "desc": "Consulting and supplier matching to move CNC, tooling and structural part sourcing from Asia to verified shops in Querétaro and Nuevo León, Mexico."},
    body="""
<h2>Why buyers consider moving production to Mexico</h2>
<ul>
  <li><b>Tariff exposure.</b> Parts made in Mexico are not subject to tariffs on China-origin goods.</li>
  <li><b>Time.</b> Delivery overland by truck replaces weeks by sea.</li>
  <li><b>Visibility.</b> Instead of an unseen supplier overseas, you work with a shop someone has walked.</li>
  <li><b>Communication.</b> Closer time zones and shared business hours make engineering questions faster to resolve.</li>
</ul>

<h2>A note on USMCA</h2>
<p>Whether a specific part qualifies for USMCA preferential treatment depends on its rules of origin and supporting documentation, not only on where the shop is located. Other duties — for example on certain metals — may also apply depending on the product. Raise it early, and confirm classification, origin and applicable duties with your customs broker or trade counsel. This page is general information, not legal or customs advice.</p>

<h2>How Arzen helps</h2>
<ol>
  <li><b>Diagnosis.</b> We look at the part you source today — tolerances, certifications, volume.</li>
  <li><b>Matched shops.</b> Pre-verified shops in Querétaro and Nuevo León that fit the specification.</li>
  <li><b>Quote and sample.</b> A physical sample before you commit to production.</li>
  <li><b>First order.</b> Managed end to end for a clean handoff.</li>
</ol>

<h2>Read the numbers</h2>
<p>Our guide <a href="/en/guides/usmca-vs-china-sourcing/">USMCA vs. China sourcing: real cost and lead-time numbers</a> lays out the comparison in detail.</p>

<h2>What we don't promise</h2>
<p>We don't promise that every part can or should move. Parts that need a long certification cycle may not be a fit. We would rather tell you that on the first call.</p>
""",
    related=["guide-usmca", "svc-verification", "loc-hub"], faqs=[
        ("Does sourcing from Mexico automatically avoid tariffs?", "Parts made in Mexico by Mexican suppliers are not subject to China-origin tariffs. Whether a part qualifies for USMCA preferential treatment depends on origin rules and documentation, so confirm with your customs broker."),
        ("Is Mexico faster than Asia?", "Overland transport by truck replaces sea freight, which cuts transit time. Our guide compares the numbers."),
        ("Can every Asian-sourced part move to Mexico?", "No. We focus on tooling, fixtures and secondary structural components. Flight-critical primes with long certification cycles are outside our focus."),
    ])

add(key="svc-quoting", kind="service", path="/en/services/quoting-sample-first-order/", foot="service", order=6,
    title="Quoting, Sample Parts & First-Order Management | Arzen",
    desc="Formal quoting, a physical sample part before you commit, and a managed first purchase order with verified CNC and tooling shops in Mexico.",
    h1="Quoting, sample parts and first-order management", short="Quoting and first order",
    lede="The first order with a new supplier is the riskiest one. Arzen manages formal quoting, a physical sample part and the first purchase order so the handoff into your normal supply chain process is clean.",
    crumbs=[("Services", "/en/services/"), ("Quoting and first order", "/en/services/quoting-sample-first-order/")],
    tldr=[("Quote:", "formal quoting from pre-verified shops matched to your spec."),
          ("Sample:", "a physical sample part before you commit to a production run — no blind orders."),
          ("First order:", "managed end to end."),
          ("Contact:", "one accountable point of contact through the first purchase order.")],
    service={"name": "Quoting, sample parts and first-order management", "type": "Procurement support",
             "desc": "Formal quoting, physical sample parts and first purchase order management with verified CNC and tooling suppliers in Mexico."},
    body="""
<h2>Formal quoting</h2>
<p>We present pre-verified shops matched to your specification and manage the formal quoting step so quotes are comparable. A complete package — drawing, tolerances, material, volume, certifications — makes that faster; the <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a> lists what to include.</p>

<h2>A physical sample before you commit</h2>
<p>A fast quote is easy to produce; a sample that passes your inspection is not. Before a production run, you receive a physical sample part made to your drawing, so you can inspect it the way you would a delivered lot. No blind orders.</p>

<h2>First order, managed end to end</h2>
<p>We stay involved through your first production order and manage it end to end, so the handoff to your supply chain process is clean. You work directly with the supplier; Arzen coordinates.</p>

<h2>Problems this solves</h2>
<ul>
  <li>Quotes that can't be compared because each shop was given different information.</li>
  <li>Committing production volume before seeing a real part.</li>
  <li>No one accountable when the first lot has a problem.</li>
</ul>

<p><b>Export controls:</b> if your drawings or technical data are export-controlled (for example ITAR or EAR), confirm with your compliance team before sharing them with any supplier outside the United States. Arzen cannot make that determination for you.</p>
<h2>What we don't do</h2>
<p>Arzen does not manufacture and does not hold inventory. We coordinate and verify; independent shops make the parts.</p>
""",
    related=["svc-verification", "svc-cnc", "contact"], faqs=[
        ("Do I have to order a sample first?", "We recommend it. A physical sample made to your drawing is the clearest way to confirm a new supplier before a production run."),
        ("Who do I contract with?", "You work directly with the supplier. Arzen coordinates quoting and the first order and remains your point of contact."),
        ("What happens after the first order?", "From there the relationship runs through your normal supply chain process. Tell us on the call what support you expect after the first lot."),
    ])

# ---------------------------------------------------------------- LOCATIONS
add(key="loc-hub", kind="hub", path="/en/locations/", foot=None, order=0,
    title="Where We Source: Querétaro & Nuevo León, Mexico | Arzen",
    desc="Arzen verifies CNC, tooling and structural shops in Querétaro and Nuevo León, Mexico, for U.S. aerospace and defense buyers across the United States.",
    h1="Where Arzen works: Querétaro and Nuevo León, Mexico — for buyers across the U.S.", short="All locations",
    lede="Arzen is a service-area business. We visit and verify supplier facilities in two Mexican states, and we serve procurement teams anywhere in the United States.",
    crumbs=[("Locations", "/en/locations/")],
    tldr=[("Supplier regions:", "Querétaro and Nuevo León, Mexico."),
          ("Buyer coverage:", "procurement teams anywhere in the United States."),
          ("How we work:", "by appointment — calls with buyers and in-person visits at supplier sites."),
          ("Contact:", "network@arzenindustrial.com")],
    body="""
<h2>Supplier regions</h2>
<div class="card-grid">
  <a class="card" href="/en/locations/queretaro/"><h3>Querétaro</h3><p>Central Mexico, an established aerospace manufacturing region. CNC machining, tooling and structural suppliers.</p></a>
  <a class="card" href="/en/locations/nuevo-leon/"><h3>Nuevo León</h3><p>Northeastern Mexico around Monterrey, the closest of our regions to Texas. CNC and tooling suppliers.</p></a>
</div>

<h2>Buyers in the United States</h2>
<p>We serve U.S. aerospace and defense procurement teams — OEMs and Tier 1/2 suppliers, defense manufacturing programs, aviation MRO and space and satellite manufacturers. Calls happen remotely; there is no need to be near our suppliers.</p>

<h2>Service and location together</h2>
<table class="spec-table">
  <caption>What we source, and where</caption>
  <thead><tr><th scope="col">Service</th><th scope="col">Regions</th></tr></thead>
  <tbody>
    <tr><th scope="row"><a href="/en/services/cnc-machining-sourcing/">CNC machining sourcing</a></th><td>Querétaro · Nuevo León</td></tr>
    <tr><th scope="row"><a href="/en/services/tooling-and-fixtures-sourcing/">Tooling and fixtures</a></th><td>Querétaro · Nuevo León</td></tr>
    <tr><th scope="row"><a href="/en/services/structural-components-sourcing/">Secondary structural components</a></th><td>Querétaro · Nuevo León</td></tr>
    <tr><th scope="row"><a href="/en/services/supplier-verification/">In-person verification</a></th><td>On site at the supplier</td></tr>
  </tbody>
</table>

<h2>Do you have an office I can visit?</h2>
<p>We work by appointment and do not publish a walk-in office address. Write to <a href="mailto:network@arzenindustrial.com">network@arzenindustrial.com</a> or <a href="/en/contact/">request a consultation</a>.</p>
""",
    related=["svc-hub", "about", "contact"], faqs=[
        ("Which Mexican states does Arzen source from?", "Querétaro and Nuevo León."),
        ("Do you serve buyers outside the United States?", "Our focus is U.S. aerospace and defense procurement teams."),
    ])

add(key="loc-queretaro", kind="location", path="/en/locations/queretaro/", foot="location", order=1,
    title="CNC & Tooling Sourcing in Querétaro, Mexico | Arzen",
    desc="Source CNC machining, tooling and secondary structural components from shops in Querétaro, Mexico, visited and verified in person by Arzen.",
    h1="CNC and tooling sourcing in Querétaro, Mexico", short="Querétaro",
    lede="Querétaro, in central Mexico, is an established aerospace manufacturing region. Arzen visits and verifies CNC, tooling and structural shops here before introducing them to U.S. buyers.",
    crumbs=[("Locations", "/en/locations/"), ("Querétaro", "/en/locations/queretaro/")],
    tldr=[("Region:", "Querétaro state, central Mexico."),
          ("What we source:", "CNC machined parts, tooling and fixtures, secondary structural components."),
          ("How:", "in-person verification before any introduction."),
          ("Buyers:", "U.S. aerospace and defense procurement teams.")],
    place={"name": "Querétaro", "sameAs": "https://en.wikipedia.org/wiki/Quer%C3%A9taro"},
    service={"name": "Supplier sourcing and verification in Querétaro", "type": "Supplier sourcing and verification",
             "desc": "Sourcing and in-person verification of CNC machining, tooling and structural suppliers in Querétaro, Mexico."},
    body="""
<h2>Why buyers look at Querétaro</h2>
<p>Querétaro is a well-established aerospace manufacturing region in central Mexico, with a concentration of precision machining and manufacturing supply chains. For a U.S. buyer, the practical questions are the same as anywhere: which shops can hold your tolerance, hit your date, and answer the phone? That is the part Arzen does.</p>

<h2>What we do in Querétaro</h2>
<ul>
  <li>Visit shops in person and confirm equipment, tolerances and capacity on site.</li>
  <li>Cross-check each shop's track record with its other clients.</li>
  <li>Match verified shops to your <a href="/en/services/cnc-machining-sourcing/">machining</a>, <a href="/en/services/tooling-and-fixtures-sourcing/">tooling</a> or <a href="/en/services/structural-components-sourcing/">structural</a> requirement.</li>
  <li>Manage <a href="/en/services/quoting-sample-first-order/">quoting, the sample part and the first order</a>.</li>
</ul>

<h2>Logistics in plain terms</h2>
<p>Parts move overland by truck across the border instead of by sea from Asia. Your customs broker should confirm classification and origin documentation for each part; see our note on <a href="/en/services/usmca-nearshoring-sourcing/">USMCA and nearshoring</a>.</p>

<h2>Before you reach out</h2>
<p>Have the drawing and tolerances, material, estimated volume, required certifications and timeline ready — or use the <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a>.</p>

<h2>Other region</h2>
<p>We also source from <a href="/en/locations/nuevo-leon/">Nuevo León</a>, in northeastern Mexico.</p>
""",
    related=["svc-cnc", "svc-verification", "loc-nuevo-leon"], faqs=[
        ("Does Arzen have an office in Querétaro?", "Arzen is a service-area business and works by appointment. We visit supplier facilities in person and do not publish a walk-in office address."),
        ("Which services are available for Querétaro suppliers?", "CNC machining sourcing, tooling and fixtures, secondary structural components, in-person verification, and managed quoting and first orders."),
    ])

add(key="loc-nuevo-leon", kind="location", path="/en/locations/nuevo-leon/", foot="location", order=2,
    title="CNC & Tooling Sourcing in Nuevo León, Mexico | Arzen",
    desc="Source CNC machining and tooling from shops in Nuevo León and the Monterrey area, visited and verified in person by Arzen for U.S. buyers.",
    h1="CNC and tooling sourcing in Nuevo León (Monterrey area), Mexico", short="Nuevo León",
    lede="Nuevo León, in northeastern Mexico around Monterrey, is the region closest to Texas among the places Arzen sources from. We verify shops here in person before we introduce them.",
    crumbs=[("Locations", "/en/locations/"), ("Nuevo León", "/en/locations/nuevo-leon/")],
    tldr=[("Region:", "Nuevo León state, northeastern Mexico (Monterrey area)."),
          ("What we source:", "CNC machined parts, tooling and fixtures, secondary structural components."),
          ("How:", "in-person verification before any introduction."),
          ("Buyers:", "U.S. aerospace and defense procurement teams.")],
    place={"name": "Nuevo León", "sameAs": "https://en.wikipedia.org/wiki/Nuevo_Le%C3%B3n"},
    service={"name": "Supplier sourcing and verification in Nuevo León", "type": "Supplier sourcing and verification",
             "desc": "Sourcing and in-person verification of CNC machining, tooling and structural suppliers in Nuevo León, Mexico."},
    body="""
<h2>Why buyers look at Nuevo León</h2>
<p>Nuevo León, anchored by the Monterrey metropolitan area, has a large industrial base and is the closest of our two regions to the Texas border. For buyers who value short overland transit, that proximity matters; what matters just as much is whether a shop can hold your tolerance. Arzen verifies that in person.</p>

<h2>What we do in Nuevo León</h2>
<ul>
  <li>Visit shops and confirm equipment, tolerances and capacity on site.</li>
  <li>Validate track record with the shop's other clients.</li>
  <li>Match verified shops to your <a href="/en/services/cnc-machining-sourcing/">machining</a> or <a href="/en/services/tooling-and-fixtures-sourcing/">tooling and fixtures</a> requirement.</li>
  <li>Coordinate <a href="/en/services/quoting-sample-first-order/">quoting, a sample part and the first order</a>.</li>
</ul>

<h2>Logistics in plain terms</h2>
<p>Parts travel overland by truck rather than by sea from Asia. Confirm classification and origin documentation with your customs broker; see <a href="/en/services/usmca-nearshoring-sourcing/">nearshoring and USMCA</a> for what to raise early.</p>

<h2>Before you reach out</h2>
<p>Bring the drawing, tolerances, material, volume, certifications and timeline. Our <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a> covers it.</p>

<h2>Other region</h2>
<p>We also source from <a href="/en/locations/queretaro/">Querétaro</a>, in central Mexico.</p>
""",
    related=["svc-tooling", "svc-verification", "loc-queretaro"], faqs=[
        ("Does Arzen have an office in Monterrey?", "Arzen works by appointment and visits supplier facilities in person. We do not publish a walk-in office address."),
        ("Is Nuevo León closer to the U.S. than Querétaro?", "Yes. Nuevo León is in northeastern Mexico and is the closer of our two regions to Texas."),
    ])

# ---------------------------------------------------------------- GUIDES
add(key="guide-hub", kind="hub", path="/en/guides/", foot=None, order=0,
    title="Guides: Sourcing CNC Parts from Mexico | Arzen Industrial",
    desc="Practical guides for U.S. buyers sourcing CNC, tooling and structural parts from Mexico: vetting suppliers, USMCA vs. China, and RFQ checklists.",
    h1="Guides for buyers sourcing CNC and tooling from Mexico", short="All guides",
    lede="Short, practical answers to the questions procurement teams ask before they commit production volume to a new supplier.",
    crumbs=[("Guides", "/en/guides/")],
    tldr=[("Audience:", "U.S. aerospace and defense procurement and supply chain teams."),
          ("Topics:", "supplier vetting, USMCA vs. China sourcing, RFQ packages."),
          ("Next step:", "request a consultation if you'd rather skip the research.")],
    body="""
<h2>All guides</h2>
<div class="card-grid">
  <a class="card" href="/en/guides/vet-cnc-supplier-mexico/"><h3>How to vet a CNC supplier in Mexico</h3><p>A buyer's checklist: equipment, sample parts, references and in-person visits.</p></a>
  <a class="card" href="/en/guides/usmca-vs-china-sourcing/"><h3>USMCA vs. China sourcing</h3><p>Real cost and lead-time numbers for tooling and structural parts.</p></a>
  <a class="card" href="/en/guides/rfq-checklist-cnc-parts-mexico/"><h3>RFQ checklist for CNC parts</h3><p>What to send a machining supplier so quotes are complete and comparable.</p></a>
</div>
<h2>Prefer a conversation?</h2>
<p>A short call about your part, tolerances, certifications and volume is the fastest route. See the <a href="/en/services/">services</a> or <a href="/en/contact/">request a consultation</a>.</p>
""",
    related=["svc-hub", "loc-hub", "contact"], faqs=[])

add(key="guide-rfq", kind="guide", path="/en/guides/rfq-checklist-cnc-parts-mexico/", foot="guide", order=3,
    title="RFQ Checklist for CNC Parts Sourced from Mexico | Arzen",
    desc="What to include in an RFQ for CNC machined parts so Mexican suppliers can quote accurately: drawings, tolerances, materials, volume, inspection and delivery.",
    h1="RFQ checklist for CNC parts sourced from Mexico", short="RFQ checklist",
    lede="An incomplete RFQ produces quotes you can't compare. This checklist covers what a machining supplier needs to price your part accurately.",
    crumbs=[("Guides", "/en/guides/"), ("RFQ checklist", "/en/guides/rfq-checklist-cnc-parts-mexico/")],
    tldr=[("Core package:", "drawing with tolerances, material, quantity and annual volume."),
          ("Often forgotten:", "inspection requirements, finish, packaging and delivery terms."),
          ("Compliance:", "confirm export-control status before sharing drawings outside the U.S."),
          ("Goal:", "quotes that are complete and comparable.")],
    published="2026-10-05",
    body="""
<h2>1. Drawing and model</h2>
<ul>
  <li>Current 2D drawing with revision level, tolerances and datums.</li>
  <li>3D model if available, with a note on which document governs when they differ.</li>
  <li>Critical-to-quality features called out clearly.</li>
</ul>

<h2>2. Material and finish</h2>
<ul>
  <li>Material specification and any required material certifications.</li>
  <li>Surface finish, coating or heat-treatment requirements, and whether a special process is performed by the shop or a separate processor.</li>
</ul>

<h2>3. Quantity and volume</h2>
<ul>
  <li>Quantity for this order and expected annual volume — volume changes which shop is the best match and how it prices.</li>
  <li>Whether this is a prototype, a first article or a repeat production part.</li>
</ul>

<h2>4. Inspection and documentation</h2>
<ul>
  <li>Inspection method and sampling plan you expect.</li>
  <li>First-article or dimensional report requirements.</li>
  <li>Certificates of conformance or other documents to ship with the parts.</li>
</ul>

<h2>5. Packaging, delivery and timeline</h2>
<ul>
  <li>Packaging and labeling requirements.</li>
  <li>Ship-to location and delivery terms.</li>
  <li>Target lead time and any hard deadline.</li>
</ul>

<h2>6. Compliance check before you send anything</h2>
<p>Confirm the export-control status of your drawings and technical data with your compliance team before sharing them with any supplier outside the United States. Arzen cannot make that determination for you.</p>

<table class="spec-table" style="margin:32px 0;">
  <caption>RFQ essentials at a glance</caption>
  <thead><tr><th scope="col">Item</th><th scope="col">Why it matters</th></tr></thead>
  <tbody>
    <tr><th scope="row">Drawing, revision, tolerances</th><td>The shop prices what it can see; missing tolerances become assumptions.</td></tr>
    <tr><th scope="row">Material and finish</th><td>Drives cost, lead time and which processors are needed.</td></tr>
    <tr><th scope="row">Quantity and annual volume</th><td>Determines fit, tooling approach and unit price.</td></tr>
    <tr><th scope="row">Inspection and documents</th><td>Avoids surprises when the first lot arrives.</td></tr>
    <tr><th scope="row">Delivery terms and timeline</th><td>Makes quotes comparable.</td></tr>
  </tbody>
</table>

<h2>Next step</h2>
<p>If you'd like pre-verified shops to quote against this package, see <a href="/en/services/quoting-sample-first-order/">quoting, sample and first order</a> or <a href="/en/contact/">request a consultation</a>. To understand what to check about the supplier itself, read <a href="/en/guides/vet-cnc-supplier-mexico/">how to vet a CNC supplier in Mexico</a>.</p>
""",
    related=["svc-quoting", "guide-vet", "svc-cnc"], faqs=[
        ("What is the minimum I need to get a quote?", "A drawing with tolerances, the material, the quantity and your target timeline. More complete packages get more accurate quotes."),
        ("Do I need a 3D model?", "A 3D model helps but the controlled 2D drawing should state which document governs."),
        ("Can I send drawings that are export-controlled?", "Confirm export-control status with your compliance team before sharing technical data with any supplier outside the United States."),
    ])

# ---------------------------------------------------------------- ABOUT / CONTACT
add(key="about", kind="about", path="/en/about/", foot=None, order=0, alt="about-es",
    title="About Arzen Industrial Group | Supplier Verification",
    desc="Who Arzen is, what it does, where it works and who it serves: in-person verification of CNC, tooling and structural suppliers in Mexico for U.S. buyers.",
    h1="About Arzen Industrial Group", short="About Arzen",
    lede="Arzen is a sourcing and in-person verification intermediary. We connect U.S. aerospace and defense procurement teams with vetted CNC, tooling and structural manufacturers in Querétaro and Nuevo León, Mexico.",
    crumbs=[("About", "/en/about/")],
    tldr=[("Who:", "Arzen Industrial Group, founded by Andrea Canabal."),
          ("What:", "in-person supplier verification, sourcing, quoting and first-order management."),
          ("Where:", "suppliers in Querétaro and Nuevo León; buyers across the United States."),
          ("For whom:", "aerospace and defense procurement teams.")],
    body="""
<h2>Who we are</h2>
<p>Arzen Industrial Group was founded by <b>Andrea Canabal</b>. We operate in English and Spanish, between U.S. buyers and Mexican manufacturers. A procurement director can find a hundred CNC shops in a search; what that search can't tell you is whether any of them can hold your tolerance, hit your date and answer the phone when something goes wrong. Closing that gap is the whole job.</p>

<h2>What we do</h2>
<ul>
  <li><a href="/en/services/supplier-verification/">In-person supplier verification</a> — we walk the shop floor before we introduce anyone.</li>
  <li><a href="/en/services/cnc-machining-sourcing/">CNC machining</a>, <a href="/en/services/tooling-and-fixtures-sourcing/">tooling and fixtures</a> and <a href="/en/services/structural-components-sourcing/">secondary structural components</a> sourcing.</li>
  <li><a href="/en/services/quoting-sample-first-order/">Quoting, a sample part and a managed first order</a>.</li>
</ul>
<p>We do not manufacture and we do not hold inventory.</p>

<h2>Where we work</h2>
<p>Supplier regions: <a href="/en/locations/queretaro/">Querétaro</a> and <a href="/en/locations/nuevo-leon/">Nuevo León</a>, Mexico. Buyers: anywhere in the United States. We work by appointment and do not publish a walk-in office address.</p>

<h2>Who we work for</h2>
<p>Procurement and supply chain teams at aerospace OEMs and Tier 1/2 suppliers, defense manufacturing programs, aviation MRO operations, and space and satellite manufacturers — with a deliberate focus on tooling, fixtures and secondary structural components rather than flight-critical primes.</p>

<h2>Problems we solve</h2>
<ul>
  <li>Supplier capability that is self-reported and unverified.</li>
  <li>Tariff exposure and long freight times on parts from Asia — see <a href="/en/services/usmca-nearshoring-sourcing/">nearshoring</a>.</li>
  <li>The risk of a first order with an unknown supplier.</li>
</ul>

<h2>Why work with Arzen</h2>
<ul>
  <li><b>In-person verification</b> instead of self-reported profiles.</li>
  <li><b>A narrow focus</b> that lets us move without a long certification cycle.</li>
  <li><b>One accountable point of contact</b> through your first purchase order.</li>
  <li><b>Honesty about fit.</b> If we're not the right fit, we'll tell you.</li>
</ul>

<h2>How to contact us</h2>
<p>Email <a href="mailto:network@arzenindustrial.com">network@arzenindustrial.com</a>, follow us on <a href="https://www.linkedin.com/company/arzen-industrial-group/" rel="noopener">LinkedIn</a>, or <a href="/en/contact/">request a consultation</a>. We reply within 1 business day.</p>
""",
    related=["svc-hub", "loc-hub", "guide-hub"], faqs=[
        ("Is Arzen a manufacturer or a marketplace?", "Neither. Arzen is a sourcing and verification intermediary: we visit and verify independent shops and connect you with the ones that fit."),
        ("What languages does Arzen work in?", "English and Spanish."),
        ("How quickly does Arzen reply?", "Within 1 business day."),
    ])

add(key="contact", kind="contact", path="/en/contact/", foot=None, order=0, alt="contact-es", form="en",
    title="Contact Arzen | Request a Sourcing Consultation",
    desc="Request a consultation to source CNC, tooling or structural parts from verified shops in Mexico. We reply within 1 business day. Email or form.",
    h1="Contact Arzen Industrial Group", short="Contact",
    lede="Tell us what you're sourcing. We reply within 1 business day to schedule a short call. Consulting engagements start at a fixed fee, discussed on the call; there is no cost to inquire.",
    crumbs=[("Contact", "/en/contact/")],
    tldr=[("Email:", "network@arzenindustrial.com"),
          ("Reply time:", "within 1 business day."),
          ("Languages:", "English and Spanish."),
          ("Format:", "a short call, no slide deck.")],
    body="""
<h2>Ways to reach us</h2>
<ul>
  <li><b>Email:</b> <a href="mailto:network@arzenindustrial.com">network@arzenindustrial.com</a></li>
  <li><b>LinkedIn:</b> <a href="https://www.linkedin.com/company/arzen-industrial-group/" rel="noopener">Arzen Industrial Group</a></li>
  <li><b>Service area:</b> United States and Mexico (Querétaro, Nuevo León). We work by appointment and do not publish a walk-in office address.</li>
</ul>

<h2>What to include</h2>
<p>Before sharing drawings, confirm their export-control status (ITAR/EAR) with your compliance team. Then send your part and drawing, tolerances, material, estimated monthly volume, required certifications and timeline. The <a href="/en/guides/rfq-checklist-cnc-parts-mexico/">RFQ checklist</a> lists the full package.</p>

<h2>Request a consultation</h2>
<!--FORM-->
""",
    related=["svc-hub", "about", "guide-hub"], faqs=[
        ("How soon will I hear back?", "Our team follows up within 1 business day to schedule a short call."),
        ("Does submitting the form commit me to anything?", "No. Submitting this form does not commit you to anything."),
    ])
