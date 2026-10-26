import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demoCatalog } from "@/lib/demo";
import type { Industry } from "@/lib/types";

const PAGES: Record<string, { sector: Industry; title: string; lead: string; pain: string; docs: string[] }> = {
  aerospace: {
    sector: "aerospace", title: "Aerospace & Defense",
    lead: "Check aluminum, titanium, nickel and steel certificates against the material specification, and hand your customer a FAIR Form 2 that points back to the source.",
    pain: "A heat-to-spec mismatch found at the customer's dock can hold the whole shipment. Arzen flags it while the material is still on your floor.",
    docs: ["MTR audit summary per heat", "AS9102 Form 2 layout (Professional)", "Append-only audit trail per certificate"],
  },
  medical: {
    sector: "medical", title: "Medical Devices",
    lead: "Every heat, every element, on record. Implant-grade titanium, stainless and cobalt-chrome certificates checked element by element.",
    pain: "An implant lot without documented material chemistry is an audit finding. Arzen keeps the check, the limits used and who confirmed what.",
    docs: ["Element-by-element chemistry check", "Values confirmed by a person are logged with name and time", "Source file fingerprint (SHA-256) on every report"],
  },
  "oil-gas": {
    sector: "oil_gas", title: "Oil, Gas & Energy",
    lead: "High-volume MTR review for pressure-containing and corrosion-critical parts, including hardness limits for sour-service material.",
    pain: "Low-alloy steel above the hardness limit for sour service is a cracking risk. Arzen checks hardness in the scale the limit is written in, and asks for review when the scales differ.",
    docs: ["Hardness checks (same-scale; cross-scale conversion only with a licensed table)", "Duplex and super duplex chemistry including nitrogen", "Email-in for certs that arrive from the mill (Professional)"],
  },
  automotive: {
    sector: "automotive", title: "Automotive & EV",
    lead: "Material test results for PPAP without retyping the certificate into a spreadsheet.",
    pain: "A late PPAP holds a launch. Arzen turns the mill cert into the material test results sheet in one step.",
    docs: ["PPAP material test results sheet (Professional)", "Carburizing and through-hardening steel chemistry", "Cast aluminum chemistry and test-bar properties"],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PAGES[params.slug];
  return p ? { title: `${p.title} MTR verification`, description: p.lead } : {};
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const p = PAGES[params.slug];
  if (!p) notFound();
  const specs = demoCatalog.filter((s) => s.industry_sector === p.sector);
  return (
    <div className="mx-auto max-w-page px-4 py-14 sm:px-6">
      <nav aria-label="Industries" className="flex flex-wrap gap-2 text-[13.5px]">
        {Object.entries(PAGES).map(([slug, x]) => (
          <Link key={slug} href={`/industries/${slug}`} aria-current={slug === params.slug ? "page" : undefined}
            className={`rounded-full border px-3 py-1 ${slug === params.slug ? "border-ink bg-ink text-paper" : "border-s300 hover:border-ink"}`}>{x.title}</Link>
        ))}
      </nav>
      <h1 className="font-display mt-8 text-[clamp(34px,5vw,52px)] font-bold leading-tight">{p.title}</h1>
      <p className="mt-4 max-w-3xl text-[18px] leading-relaxed text-alloy">{p.lead}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-s100 bg-white p-6">
          <h2 className="text-[17px] font-semibold">Why it matters</h2>
          <p className="mt-2 text-[15.5px] leading-relaxed text-alloy">{p.pain}</p>
        </div>
        <div className="rounded-md border border-s100 bg-white p-6">
          <h2 className="text-[17px] font-semibold">What you get</h2>
          <ul className="mt-2 space-y-2 text-[15.5px]">{p.docs.map((d) => <li key={d} className="flex gap-2"><span aria-hidden className="mt-[10px] h-[2px] w-3 shrink-0 bg-ink" />{d}</li>)}</ul>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="font-display text-[26px] font-bold">Starter catalog for this industry</h2>
        <p className="mt-2 max-w-3xl text-[15px] text-alloy">
          These entries are a draft we are verifying against the licensed edition of each standard. Until an entry is verified, results against it read “needs review”, never “within limits”. You can also load your own or your customer's limits.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse bg-white text-[14px]">
            <thead><tr className="bg-ink text-paper"><th scope="col" className="px-3 py-2 text-left font-medium">Specification</th><th scope="col" className="px-3 py-2 text-left font-medium">Material</th><th scope="col" className="px-3 py-2 text-left font-medium">Form</th><th scope="col" className="px-3 py-2 text-left font-medium">Status</th></tr></thead>
            <tbody>
              {specs.map((s) => (
                <tr key={`${s.spec_code}-${s.alloy_designation}-${s.product_form}`} className="border-t border-s100">
                  <td className="num px-3 py-2">{s.spec_code}</td><td className="px-3 py-2">{s.alloy_designation}</td>
                  <td className="px-3 py-2 text-alloy">{s.product_form}</td>
                  <td className="px-3 py-2"><span className="rounded-[3px] bg-warnbg px-2 py-0.5 font-mono text-[11.5px] text-warn">● DRAFT</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/check" className="rounded bg-blue px-5 py-3 font-medium text-white">Check an MTR free</Link>
        <Link href="/sample-report" className="rounded border border-ink px-5 py-3 font-medium">See a sample report</Link>
      </div>
    </div>
  );
}
