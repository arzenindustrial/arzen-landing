import Link from "next/link";
import { IconExport, IconExtract, IconUpload, IconValidate } from "@/components/icons";
import { FreeCheck } from "./check/free-check";
import { PRICING_NOTES, PricingCards } from "@/components/pricing-cards";
import { ResultsTable } from "@/components/results-table";
import { CountsLine } from "@/components/status";
import { TransformVisual } from "@/components/transform-visual";
import { demoDocs } from "@/lib/demo";

const INDUSTRIES = [
  { slug: "aerospace", title: "Aerospace & Defense", line: "Material checks for every heat, and FAIR Form 2 packages in the AS9102 layout." },
  { slug: "medical", title: "Medical Devices", line: "Titanium and stainless implant grades checked element by element, on record." },
  { slug: "oil-gas", title: "Oil, Gas & Energy", line: "High-volume MTR review, including hardness limits for sour-service material." },
  { slug: "automotive", title: "Automotive & EV", line: "PPAP material test results without retyping the cert into a spreadsheet." },
];

const FAQ = [
  ["What happens to my data?", "Certificates you upload with an account are stored in your organization's private space, separated from every other customer by database row-level security. Each one gets a SHA-256 fingerprint and an append-only audit trail. The free check does not store your file."],
  ["Does it replace my ERP or QMS?", "No. Arzen does one job: certificates in, checked results and audit-ready PDFs out. Export what you need and file it where you already do."],
  ["Which specifications are covered?", "A starter catalog of common aerospace, medical, energy and automotive grades, which we are verifying against the licensed standards before any result can read “within limits”. You can also add your customer's or your own limits."],
  ["How do I know the reading is right?", "Every value shows where it came from on the source page. If the reading is uncertain, or a number does not appear in the document, Arzen marks it REVIEW and asks a person to confirm it. Nothing uncertain passes silently."],
  ["Does Arzen approve material?", "No. Arzen checks numbers against limits and shows its work. Releasing material stays with your quality team."],
];

export default function Home() {
  const sample = demoDocs[0];
  return (
    <>
      {/* Hero */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-page items-center gap-12 px-4 pb-16 pt-12 sm:px-6 xl:grid-cols-[1fr_1.05fr] md:pb-24 md:pt-20">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-alloy">MTR verification · FAIR · PPAP</p>
            <h1 className="font-display mt-4 text-[clamp(38px,6vw,64px)] font-bold leading-[1.05] text-ink">Stop highlighting. Start shipping.</h1>
            <p className="mt-5 max-w-[34rem] text-[18px] leading-relaxed text-alloy">
              Arzen reads your material test reports, checks every value against the specification, and builds the audit package.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/check" className="rounded bg-blue px-5 py-3 font-medium text-white hover:bg-[#1c43bb]">Check an MTR free</Link>
              <Link href="/sample-report" className="rounded border border-ink px-5 py-3 font-medium text-ink hover:bg-white">See a sample report</Link>
            </div>
            <p className="mt-4 text-[13.5px] text-alloy">No credit card. Your file is not stored.</p>
          </div>
          <TransformVisual />
        </div>
      </section>

      {/* Barra de prueba: solo contenido verdadero */}
      <section className="border-y border-s100 bg-white">
        <ul className="mx-auto flex max-w-page flex-wrap justify-center gap-x-10 gap-y-2 px-4 py-4 font-mono text-[12.5px] text-alloy sm:px-6">
          <li>PDF · JPG · PNG · TIFF</li><li>Scanned or digital certificates</li><li>No ERP required</li><li>Monthly plan, no contract</li>
        </ul>
      </section>

      {/* Read · Validate · Package */}
      <section className="mx-auto max-w-page px-4 py-20 sm:px-6">
        <h2 className="font-display max-w-2xl text-[30px] font-bold leading-tight">Reading is separate from deciding.</h2>
        <p className="mt-3 max-w-2xl text-[17px] text-alloy">The extraction model only reads. Fixed rules decide. Same input, same result, every time.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [IconExtract, "Read", "OCR and an extraction model copy each value with its unit and where it sits on the page. A value that is not in the document cannot pass."],
            [IconValidate, "Validate", "Deterministic code compares each chemical and mechanical value with the limit, converts ksi to MPa, and handles values like “<0.005”."],
            [IconExport, "Package", "Export the MTR audit summary, AS9102 Form 2 and PPAP material sheets, each with the source file's SHA-256."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-md border border-s100 bg-white p-6">
              <Icon className="text-ink" />
              <h3 className="mt-4 text-[17px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-alloy">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vista previa del producto sobre Ink */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-s300">Validation results · sample data</p>
          <h2 className="font-display mt-3 text-[30px] font-bold">Result first. Then the reason.</h2>
          <div className="mt-6 rounded-lg bg-[#16212E] p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="num text-[13px] text-s300">{sample.spec?.alloy_designation} · {sample.validation.spec_label} · Heat {sample.heat_number}</p>
              <CountsLine counts={sample.validation.counts} />
            </div>
            <div className="text-ink">
              <ResultsTable checks={sample.validation.checks.filter((c) => c.category === "chemistry")} />
            </div>
            <p className="mt-3 font-mono text-[11.5px] text-s300">Output of the Arzen engine on a synthetic certificate. Limits shown are a draft catalog entry.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-page scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="font-display text-[30px] font-bold">How it works</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            [IconUpload, "1 · Upload MTR", "Drag in a scan, photo, or PDF, or forward it to your Arzen email address. Heat number and specification are detected."],
            [IconValidate, "2 · Validate", "Every chemical and mechanical value is checked against the limits of the governing specification."],
            [IconExport, "3 · Export FAIR", "Get an AS9102 Form 2 layout with source references, ready to complete and send to your customer."],
          ].map(([Icon, t, d]: any) => (
            <li key={t} className="border-t-2 border-ink pt-5">
              <Icon />
              <h3 className="mt-3 text-[17px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-alloy">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Industrias */}
      <section className="border-t border-s100 bg-white">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6">
          <h2 className="font-display text-[30px] font-bold">One engine. Four industries.</h2>
          <p className="mt-3 max-w-2xl text-[17px] text-alloy">Pick your industry and Arzen loads the matching catalog of material limits. The checking engine is the same.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((i) => (
              <Link key={i.slug} href={`/industries/${i.slug}`} className="group rounded-md border border-s300 bg-paper p-5 hover:border-ink">
                <h3 className="text-[16.5px] font-semibold">{i.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-alloy">{i.line}</p>
                <span className="mt-4 inline-block text-[14px] font-medium text-ink underline-offset-2 group-hover:underline">Details</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free check */}
      <section className="mx-auto max-w-page px-4 py-20 sm:px-6">
        <div className="grid items-start gap-10 rounded-lg border border-s300 bg-white p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[30px] font-bold">Try it on one of your own certificates.</h2>
            <p className="mt-3 text-[17px] text-alloy">See which elements are within limits, in your browser. No account, no card. The file is processed and discarded.</p>
            <Link href="/check" className="mt-4 inline-block font-medium text-ink underline underline-offset-2">What happens to your file</Link>
          </div>
          <FreeCheck />
        </div>
      </section>

      {/* Precios */}
      <section className="border-t border-s100 bg-white">
        <div className="mx-auto max-w-page px-4 py-20 sm:px-6">
          <h2 className="font-display text-[30px] font-bold">Pricing</h2>
          <p className="mt-3 text-[17px] text-alloy">Sign up, pay by card, start the same day.</p>
          <div className="mt-10"><PricingCards /></div>
          <ul className="mt-6 space-y-1 text-[13.5px] text-alloy">{PRICING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      </section>

      {/* Confianza */}
      <section className="mx-auto max-w-page px-4 py-20 sm:px-6">
        <h2 className="font-display text-[30px] font-bold">Say what we checked, and what we didn't.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Evidence over claims", "Each value links to its page and row in your original file. Every report lists what was not checked."],
            ["Traceable by default", "Every certificate gets a SHA-256 fingerprint. Every action is written to an append-only, hash-chained audit trail."],
            ["Your data stays yours", "Row-level isolation per organization. Encrypted in transit and at rest. No drawings, CAD or controlled technical data."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-md border border-s100 bg-white p-6">
              <h3 className="text-[16.5px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-alloy">{d}</p>
            </div>
          ))}
        </div>
        <Link href="/trust" className="mt-6 inline-block font-medium text-ink underline underline-offset-2">Visit the trust center</Link>
      </section>

      {/* FAQ */}
      <section className="border-t border-s100 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-[30px] font-bold">Questions</h2>
          <div className="mt-8 divide-y divide-s100 border-y border-s100">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16.5px] font-medium">
                  {q}<span aria-hidden className="font-mono text-alloy group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15.5px] leading-relaxed text-alloy">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-page flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display max-w-xl text-[34px] font-bold leading-tight">Catch the deviation before the customer does.</h2>
          <Link href="/check" className="rounded bg-blue px-5 py-3 font-medium text-white hover:bg-[#1c43bb]">Check an MTR free</Link>
        </div>
      </section>
    </>
  );
}
