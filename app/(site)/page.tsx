import type { Metadata } from "next";
import Link from "next/link";
import { Symbol } from "@/components/brand";
import { AuditChain, Pipeline, ReadVsDecide, SectionHead, SpecMarquee } from "@/components/home-sections";
import { HeroInspection } from "@/components/hero-inspection";
import { JsonLd, faqPage, softwareApp } from "@/components/json-ld";
import { IconAerospace, IconAutomotive, IconEnergy, IconEye, IconChain, IconLock, IconMedical } from "@/components/icons";
import { FreeCheck } from "./check/free-check";
import { PRICING_NOTES, PricingCards } from "@/components/pricing-cards";
import { ProductPreview } from "@/components/product-preview";
import { demoCatalog, isDemo } from "@/lib/demo";
import { stagger } from "@/lib/motion";
import type { Industry } from "@/lib/types";

const INDUSTRIES: { slug: string; sector: Industry; title: string; line: string; Icon: typeof IconAerospace }[] = [
  { slug: "aerospace", sector: "aerospace", title: "Aerospace & Defense", line: "Material checks for every heat, and FAIR Form 2 packages in the AS9102 layout.", Icon: IconAerospace },
  { slug: "medical", sector: "medical", title: "Medical Devices", line: "Titanium and stainless implant grades checked element by element, on record.", Icon: IconMedical },
  { slug: "oil-gas", sector: "oil_gas", title: "Oil, Gas & Energy", line: "High-volume MTR review, including hardness limits for sour-service material.", Icon: IconEnergy },
  { slug: "automotive", sector: "automotive", title: "Automotive & EV", line: "PPAP material test results without retyping the cert into a spreadsheet.", Icon: IconAutomotive },
];

export const metadata: Metadata = { alternates: { canonical: "/" } };

const FAQ = [
  ["What happens to my data?", "Certificates you upload with an account are stored in your organization's private space, separated from every other customer by database row-level security. Each one gets a SHA-256 fingerprint and an append-only audit trail. The free check does not store your file."],
  ["Does it replace my ERP or QMS?", "No. Arzen does one job: certificates in, checked results and audit-ready PDFs out. Export what you need and file it where you already do."],
  ["Which specifications are covered?", "A starter catalog of common aerospace, medical, energy and automotive grades, which we are verifying against the licensed standards before any result can read “within limits”. You can also add your customer's or your own limits."],
  ["How do I know the reading is right?", "Every value shows where it came from on the source page. If the reading is uncertain, or a number does not appear in the document, Arzen marks it REVIEW and asks a person to confirm it. Nothing uncertain passes silently."],
  ["Does Arzen approve material?", "No. Arzen checks numbers against limits and shows its work. Releasing material stays with your quality team."],
];

const TRUST = [
  { Icon: IconEye, t: "Evidence over claims", d: "Each value links to its page and row in your original file. Every report lists what was not checked." },
  { Icon: IconChain, t: "Traceable by default", d: "Every certificate gets a SHA-256 fingerprint. Every action is written to an append-only, hash-chained audit trail." },
  { Icon: IconLock, t: "Your data stays yours", d: "Row-level isolation per organization. Encrypted in transit and at rest. No drawings, CAD or controlled technical data." },
];

export default function Home() {
  return (
    <>
      <JsonLd data={softwareApp()} />
      <JsonLd data={faqPage(FAQ)} />
      {/* Hero: banco de inspección sobre Ink, con retícula de plano */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div aria-hidden className="bp-grid bp-fade absolute inset-0" />
        <div className="relative mx-auto max-w-page px-4 pb-14 pt-14 sm:px-6 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="hx-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-s300 sm:text-[11.5px] sm:tracking-[0.16em]" style={{ ["--t" as string]: "0ms" }}>
              <span aria-hidden className="h-1.5 w-1.5 bg-[var(--blue-on-ink)]" />MTR verification · AS9102 FAIR · PPAP
            </p>
            <h1 className="font-display mt-6 text-[clamp(40px,6.4vw,76px)] font-bold leading-[1.02] tracking-[-0.015em]">
              Stop <span className="marker text-ink">highlighting</span>.<br />
              Start <span className="scan-under">shipping</span>.
            </h1>
            <p className="hx-in mx-auto mt-6 max-w-[38rem] text-[18px] leading-relaxed text-s300" style={{ ["--t" as string]: "200ms" }}>
              Arzen reads your material test reports, checks every chemical and mechanical value against the specification, and builds the audit package.
            </p>
            <div className="hx-in mt-8 flex flex-wrap justify-center gap-3" style={{ ["--t" as string]: "300ms" }}>
              <Link href="/check" className="group inline-flex items-center gap-2 rounded bg-blue px-5 py-3 font-medium text-white transition-colors hover:bg-[#1c43bb]">
                Check an MTR free <span aria-hidden className="arrow">→</span>
              </Link>
              <Link href="/sample-report" className="rounded border border-white/25 px-5 py-3 font-medium text-paper transition-colors hover:border-white/60 hover:bg-white/5">
                See a sample report
              </Link>
            </div>
            <ul className="hx-in mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[12px] text-s300" style={{ ["--t" as string]: "400ms" }}>
              <li>No credit card</li><li aria-hidden>·</li><li>File not stored</li><li aria-hidden>·</li><li>PDF · JPG · PNG · TIFF</li>
            </ul>
          </div>
          <div className="brackets relative mx-auto mt-14 max-w-[1040px] rounded-lg p-4 sm:p-7" style={{ ["--bk" as string]: "rgba(111,147,255,.7)", ["--bs" as string]: "18px" }}>
            <div aria-hidden className="pointer-events-none absolute inset-3 rounded-md border border-white/[0.07] bg-white/[0.02]" />
            <div className="relative"><HeroInspection /></div>
          </div>
        </div>
      </section>

      <SpecMarquee />

      {/* Cómo funciona */}
      <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden">
        <div aria-hidden className="bp-grid-light absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-page px-4 py-24 sm:px-6">
          <SectionHead tag="How it works" title="Four stations. One certificate at a time." lead="From a crooked phone photo to an audit-ready package, without retyping a single number." />
          <Pipeline />
        </div>
      </section>

      {/* Lee ≠ decide + producto */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div aria-hidden className="bp-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-page px-4 py-24 sm:px-6">
          <SectionHead dark tag="Reading is separate from deciding" title="Result first. Then the reason." lead="The extraction model only reads. Fixed rules decide. Click any value to see where it came from and which rule judged it." />
          <ReadVsDecide />
          <div data-reveal="scale" className="mt-10"><ProductPreview /></div>
          <p className="mt-3 font-mono text-[11.5px] text-s300">Output of the Arzen engine on a synthetic certificate for a fictitious mill. Limits come from a draft catalog entry.</p>
        </div>
      </section>

      {/* Industrias */}
      <section className="bg-white">
        <div className="mx-auto max-w-page px-4 py-24 sm:px-6">
          <SectionHead tag="Industries" title="One engine. Four industries." lead="Pick your industry and Arzen loads the matching catalog of material limits. The checking engine is the same." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((i, n) => {
              const specs = Array.from(new Set(demoCatalog.filter((s) => s.industry_sector === i.sector).map((s) => s.spec_code)));
              return (
                <Link key={i.slug} href={`/industries/${i.slug}`} data-reveal style={stagger(n, 90)}
                  className="card-lift group flex flex-col rounded-md border border-s100 bg-paper p-5 hover:border-s300">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-ink text-paper transition-colors group-hover:bg-blue"><i.Icon size={22} /></span>
                  <h3 className="mt-5 text-[17px] font-semibold">{i.title}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-alloy">{i.line}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {specs.slice(0, 3).map((code) => <li key={code} className="rounded-[3px] border border-s300 bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-alloy">{code}</li>)}
                    {specs.length > 3 && <li className="px-1 py-0.5 font-mono text-[10.5px] text-alloy">+{specs.length - 3}</li>}
                  </ul>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">Details <span aria-hidden className="arrow text-blue">→</span></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prueba gratis */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bp-grid-light absolute inset-0" />
        <div className="relative mx-auto max-w-page px-4 py-24 sm:px-6">
          <div data-reveal className="brackets grid items-start gap-10 rounded-lg bg-white p-6 shadow-[0_24px_60px_-36px_rgba(14,22,33,.45)] sm:p-10 md:grid-cols-2" style={{ ["--bs" as string]: "16px", ["--bw" as string]: "2px" }}>
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-blue"><span aria-hidden className="h-[2px] w-5 bg-blue" />Free check</p>
              <h2 className="font-display mt-3 text-[clamp(28px,3.4vw,38px)] font-bold leading-[1.08]">Try it on one of your own certificates.</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-alloy">See which elements are within limits, in your browser. No account, no card. The file is processed and discarded.</p>
              <ol className="mt-6 space-y-3 text-[15px]">
                {["Drop one MTR", "Arzen reads and checks the chemistry", "See pass, deviation and review counts"].map((x, i) => (
                  <li key={x} className="flex items-center gap-3"><span className="num flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] bg-ink text-[11px] text-paper">{i + 1}</span>{x}</li>
                ))}
              </ol>
              <Link href="/check" className="mt-6 inline-flex items-center gap-1.5 font-medium text-ink underline underline-offset-4 hover:text-blue">What happens to your file <span aria-hidden className="arrow">→</span></Link>
            </div>
            <FreeCheck />
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="bg-white">
        <div className="mx-auto max-w-page px-4 py-24 sm:px-6">
          <SectionHead tag="Pricing" title={isDemo() ? "Two plans. No implementation project." : "Two plans. Start the same day."}
            lead={isDemo() ? "Monthly, by card. No contract, no implementation fee. Accounts are opening in stages: request early access from either plan." : "Sign up, pay by card, upload your first certificate. No call, no contract, no implementation fee."} />
          <div data-reveal className="mt-12"><PricingCards /></div>
          <ul className="mt-6 space-y-1 text-[13.5px] text-alloy">{PRICING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      </section>

      {/* Confianza */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bp-grid-light absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-page items-start gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHead tag="Trust" title="Say what we checked, and what we didn't." />
            <ul className="mt-8 space-y-4">
              {TRUST.map(({ Icon, t, d }, i) => (
                <li key={t} data-reveal style={stagger(i, 100)} className="card-lift flex gap-4 rounded-md border border-s100 bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border-2 border-ink text-ink"><Icon size={20} /></span>
                  <div><h3 className="text-[16.5px] font-semibold">{t}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-alloy">{d}</p></div>
                </li>
              ))}
            </ul>
            <Link href="/trust" className="mt-6 inline-flex items-center gap-1.5 font-medium text-ink underline underline-offset-4 hover:text-blue">Visit the trust center <span aria-hidden className="arrow">→</span></Link>
          </div>
          <div data-reveal="scale" className="lg:mt-16"><AuditChain /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-page gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead tag="FAQ" title="Questions" lead="Straight answers. If yours isn't here, the trust center has the details." />
          <div data-reveal className="divide-y divide-s100 border-y border-s100">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16.5px] font-medium transition-colors hover:text-blue">
                  {q}
                  <span aria-hidden className="faq-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px] border border-s300 font-mono text-alloy group-open:border-blue group-open:text-blue">+</span>
                </summary>
                <p className="faq-body pb-5 pr-10 text-[15.5px] leading-relaxed text-alloy">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div aria-hidden className="bp-grid bp-fade absolute inset-0" />
        <div className="relative mx-auto flex max-w-page flex-col items-center px-4 py-24 text-center sm:px-6">
          <div data-reveal><Symbol size={64} reversed /></div>
          <h2 data-reveal style={stagger(1, 100)} className="font-display mt-8 max-w-2xl text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.05]">Catch the deviation before the customer does.</h2>
          <p data-reveal style={stagger(2, 100)} className="mt-4 max-w-xl text-[17px] text-s300">Run one of your own certificates through Arzen. All it takes is the file.</p>
          <div data-reveal style={stagger(3, 100)} className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/check" className="group inline-flex items-center gap-2 rounded bg-blue px-6 py-3.5 font-medium text-white transition-colors hover:bg-[#1c43bb]">Check an MTR free <span aria-hidden className="arrow">→</span></Link>
            <Link href="/pricing" className="rounded border border-white/25 px-6 py-3.5 font-medium text-paper transition-colors hover:border-white/60 hover:bg-white/5">See plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
