import { createHash } from "crypto";
import { IconExport, IconExtract, IconMail, IconUpload, IconValidate } from "./icons";
import { RangeBar } from "./range-bar";
import { ResultBadge } from "./status";
import { demoCatalog, demoDocs } from "@/lib/demo";
import { stagger } from "@/lib/motion";

/** Encabezado de sección con etiqueta mono de "estación". */
export function SectionHead({ tag, title, lead, dark = false, center = false }: { tag: string; title: React.ReactNode; lead?: React.ReactNode; dark?: boolean; center?: boolean }) {
  return (
    <div data-reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.18em] ${dark ? "text-[var(--blue-on-ink)]" : "text-blue"}`}>
        <span aria-hidden className={`h-[2px] w-5 ${dark ? "bg-[var(--blue-on-ink)]" : "bg-blue"}`} />{tag}
      </p>
      <h2 className={`font-display mt-3 text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.08] ${dark ? "text-paper" : "text-ink"}`}>{title}</h2>
      {lead && <p className={`mt-4 text-[17px] leading-relaxed ${dark ? "text-s300" : "text-alloy"}`}>{lead}</p>}
    </div>
  );
}

/** Cinta con el catálogo inicial (borrador, se rotula como tal). */
export function SpecMarquee() {
  const items = demoCatalog.map((s) => `${s.spec_code} · ${s.alloy_designation}`);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((x, i) => (
        <li key={`${x}-${i}`} className="flex items-center gap-8 whitespace-nowrap font-mono text-[12.5px] text-s300">
          {x}<span aria-hidden className="h-1 w-1 bg-[var(--blue-on-ink)]" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Starter specification catalog" className="border-y border-white/10 bg-[#121C28]">
      <div className="mx-auto flex max-w-page items-center gap-6 px-4 sm:px-6">
        <p className="hidden shrink-0 py-3.5 font-mono text-[11px] uppercase leading-tight tracking-[0.14em] text-paper md:block">
          {items.length} specs<br /><span className="text-s300">draft catalog</span>
        </p>
        <div className="marquee min-w-0 flex-1 overflow-hidden py-3.5">
          <div className="marquee-track flex">{row(false)}{row(true)}</div>
        </div>
      </div>
    </section>
  );
}

const FE = demoDocs[0].validation.checks.find((c) => c.property === "Fe")!;

/** Cómo funciona: cuatro estaciones unidas por una banda transportadora. */
export function Pipeline() {
  const stations = [
    {
      n: "01", Icon: IconUpload, t: "Upload", d: "Drag in a scan, a phone photo or a PDF. Or forward the mill's email to your Arzen address.",
      v: (
        <div className="space-y-1.5 font-mono text-[11px]">
          {["MTR_0Y7K-2291.pdf", "IMG_4130_heat.jpg"].map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-[3px] border border-s100 bg-white px-2 py-1"><span className="h-2 w-2 bg-s300" />{f}</div>
          ))}
          <div className="flex items-center gap-2 rounded-[3px] border border-dashed border-blue/60 px-2 py-1 text-blue"><IconMail size={13} />Forward to your Arzen inbox</div>
        </div>
      ),
    },
    {
      n: "02", Icon: IconExtract, t: "Read", d: "OCR and an extraction model copy each value, its unit and where it sits on the page. Nothing else.",
      v: (
        <div className="font-mono text-[11px] leading-relaxed">
          <div className="rounded-[3px] bg-[#FBFAF6] px-2 py-1 text-s500">… 4.00 <span className="rounded-[2px] outline outline-[1.5px] outline-blue">0.27</span> 0.11 …</div>
          <div className="mt-1.5 rounded-[3px] bg-ink px-2 py-1.5 text-s300">
            {"{ "}<span className="text-paper">&quot;Fe&quot;</span>: <span className="text-[var(--blue-on-ink)]">0.27</span>, &quot;unit&quot;: &quot;%&quot;, &quot;page&quot;: 1 {"}"}
          </div>
        </div>
      ),
    },
    {
      n: "03", Icon: IconValidate, t: "Validate", d: "Fixed rules compare every value with the limit. Same input, same result, every time.",
      v: (
        <div className="rounded-[3px] border border-s100 bg-white px-2.5 py-2">
          <div className="flex items-center justify-between font-mono text-[11px]"><span>Fe 0.27 %</span><span className="text-alloy">{FE.requirement}</span></div>
          <RangeBar className="my-2" value={FE.measured_value} requirement={FE.requirement} result={FE.result} />
          <ResultBadge compact result="DEVIATION" suffix="+0.02" />
        </div>
      ),
    },
    {
      n: "04", Icon: IconExport, t: "Export", d: "Audit summary, AS9102 Form 2 and PPAP material sheets, each stamped with the file's SHA-256.",
      v: (
        <div className="space-y-1.5 font-mono text-[11px]">
          {["audit-summary.pdf", "as9102-form2.pdf", "ppap-material.pdf"].map((f, i) => (
            <div key={f} className="flex items-center justify-between gap-2 rounded-[3px] border border-s100 bg-white px-2 py-1" style={{ marginLeft: i * 6 }}>
              <span className="flex items-center gap-2"><IconExport size={12} className="text-blue" />{f}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <div className="relative mt-12">
      {/* Banda transportadora (solo escritorio) */}
      <svg aria-hidden className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-[2px] w-[75%] lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
        <line x1="0" y1="1" x2="100" y2="1" stroke="var(--blue)" strokeWidth="2" vectorEffect="non-scaling-stroke" className="conveyor" />
      </svg>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stations.map(({ n, Icon, t, d, v }, i) => (
          <li key={n} data-reveal style={stagger(i, 110)} className="relative flex flex-col">
            <div className="flex items-center gap-3 lg:flex-col lg:items-center">
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-[4px] border-2 border-ink bg-paper text-ink">
                <Icon size={20} />
              </span>
              <span className="num text-[12px] text-alloy lg:mt-2">STATION {n}</span>
            </div>
            <div className="card-lift mt-4 flex flex-1 flex-col rounded-md border border-s100 bg-white p-5">
              <h3 className="font-display text-[20px] font-bold">{t}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-alloy">{d}</p>
              <div className="mt-4 rounded-[4px] bg-paper p-2.5">{v}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Lee ≠ decide: el corazón de la arquitectura, en dos columnas. */
export function ReadVsDecide() {
  const cols = [
    { k: "The model reads", tone: "text-s300", items: ["Transcribes each value, its unit and its page position", "A number not found in the OCR text drops to low confidence and is marked REVIEW", "Never sees the limits. Never decides."] },
    { k: "The code decides", tone: "text-[var(--blue-on-ink)]", items: ["Compares in exact decimal arithmetic against the limit shown", "Converts ksi to MPa, reads values like “<0.005”", "Draft limits can never produce a PASS"] },
  ];
  return (
    <div className="relative mt-10 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 md:grid-cols-2">
      {cols.map((c, i) => (
        <div key={c.k} data-reveal style={stagger(i, 120)} className="bg-[#121C28] p-6">
          <p className={`font-mono text-[12px] uppercase tracking-[0.16em] ${c.tone}`}>{c.k}</p>
          <ul className="mt-4 space-y-3 text-[15px] text-paper/90">
            {c.items.map((x) => <li key={x} className="flex gap-3"><span aria-hidden className={`mt-[10px] h-[2px] w-3 shrink-0 ${i ? "bg-[var(--blue-on-ink)]" : "bg-s300"}`} />{x}</li>)}
          </ul>
        </div>
      ))}
      <span aria-hidden className="absolute left-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[4px] border border-white/15 bg-ink font-mono text-[18px] text-paper md:flex">≠</span>
    </div>
  );
}

/** Bitácora encadenada: hashes SHA-256 reales calculados en el build sobre eventos de ejemplo. */
export function AuditChain() {
  const events = [
    ["cert.uploaded", "MTR_0Y7K-2291.pdf"],
    ["cert.validated", "1 deviation · 11 pass · 1 review"],
    ["fair.exported", "as9102-form2.pdf"],
    ["report.exported", "audit-summary.pdf"],
  ];
  let prev = "0".repeat(64);
  const ts0 = 1792922400;
  const blocks = events.map(([action, detail], i) => {
    const ts = ts0 + i * 97;
    const hash = createHash("sha256").update(`${prev}|${ts}|${action}|${detail}`).digest("hex");
    const b = { action, detail, ts, prev, hash };
    prev = hash;
    return b;
  });
  return (
    <div className="rounded-lg bg-ink p-5 text-paper sm:p-6">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-s300">
        <span>audit_log · append-only</span><span>illustrative</span>
      </div>
      <ol className="mt-4 space-y-2.5">
        {blocks.map((b, i) => (
          <li key={b.hash} data-reveal style={stagger(i, 140)} className="relative rounded-[4px] border border-white/10 bg-[#16212E] p-3 font-mono text-[11.5px]">
            {i > 0 && <span aria-hidden className="absolute -top-[11px] left-6 h-[10px] w-[2px] bg-[var(--blue-on-ink)]" />}
            <div className="flex items-center justify-between gap-3">
              <span className="text-paper">{b.action}</span><span className="num text-s300">ts {b.ts}</span>
            </div>
            <div className="mt-1 truncate text-s300">{b.detail}</div>
            <div className="mt-1.5 grid grid-cols-[3.2rem_1fr] gap-x-2 text-[10.5px]">
              <span className="text-s500">prev</span><span className={`truncate ${i ? "text-[var(--blue-on-ink)]" : "text-s500"}`}>{b.prev.slice(0, 24)}…</span>
              <span className="text-s500">hash</span><span className="truncate text-paper/85">{b.hash.slice(0, 24)}…</span>
            </div>
          </li>
        ))}
      </ol>
      <p data-reveal style={stagger(4, 140)} className="mt-4 flex items-center gap-2 font-mono text-[11.5px] text-s300">
        <span aria-hidden className="h-1.5 w-1.5 bg-[var(--blue-on-ink)]" />Each entry carries the previous hash. Editing history breaks the chain.
      </p>
    </div>
  );
}
