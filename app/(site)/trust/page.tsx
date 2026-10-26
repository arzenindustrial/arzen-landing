import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trust center",
  description: "How Arzen isolates, protects and traces your certificates, which providers process data, and the status of security certifications.",
};

const CERTS: [string, string, string][] = [
  ["SOC 2 Type I", "Planned", "No audit scheduled yet."],
  ["SOC 2 Type II", "Planned", "Follows Type I."],
  ["ISO/IEC 27001", "Not planned yet", "—"],
  ["CMMC", "Not applicable at launch", "Arzen does not accept CUI, drawings or CAD. See what Arzen does not do."],
];

const SUBPROCESSORS: [string, string, string][] = [
  ["Supabase", "Database and sign-in", "US region (set at launch)"],
  ["Railway", "Application servers", "US region (set at launch)"],
  ["Vercel", "Website hosting", "Global edge network"],
  ["Cloudflare R2", "Storage of uploaded certificates", "US jurisdiction (set at launch)"],
  ["Amazon Web Services (Textract)", "Optical character recognition", "US region (set at launch)"],
  ["Anthropic", "Extraction of values into structured data", "United States"],
  ["Stripe", "Card payments and invoices", "United States"],
];

export default function Trust() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-[clamp(34px,5vw,52px)] font-bold">Trust center</h1>
      <p className="mt-3 text-[17px] text-alloy">What is in place today, described plainly. Last updated 2026-10-25.</p>

      <h2 className="font-display mt-12 text-[24px] font-bold">How a certificate is handled</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          ["Isolation", "Each organization's certificates are separated by row-level security in the database, so one customer's queries cannot return another's rows."],
          ["Encryption", "Connections use TLS. Stored data is encrypted at rest by our database and storage providers."],
          ["Fingerprint", "Each uploaded file gets a SHA-256 hash, printed on every report generated from it."],
          ["Audit trail", "Every upload, confirmation and export is written to an append-only log. Each entry carries a Unix timestamp and a hash chained to the previous entry, so an edit to history is detectable."],
          ["Reading vs. deciding", "OCR and an extraction model read the values. Pass or fail is decided by fixed code against the limits shown, never by a model."],
          ["Human confirmation", "Uncertain reads are marked for review. When a person confirms a value, the original reading is kept next to the confirmation, with who and when."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-md border border-s100 bg-white p-5"><dt className="font-semibold">{t}</dt><dd className="mt-1.5 text-[15px] leading-relaxed text-alloy">{d}</dd></div>
        ))}
      </dl>

      <h2 className="font-display mt-12 text-[24px] font-bold">Certifications</h2>
      <p className="mt-2 text-[15px] text-alloy">Arzen holds no security certification today. Status changes here only with an auditor's report.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse bg-white text-[14.5px]">
          <thead><tr className="bg-ink text-paper"><th scope="col" className="px-3 py-2 text-left font-medium">Framework</th><th scope="col" className="px-3 py-2 text-left font-medium">Status</th><th scope="col" className="px-3 py-2 text-left font-medium">Note</th></tr></thead>
          <tbody>{CERTS.map(([a, b, c]) => <tr key={a} className="border-t border-s100"><td className="px-3 py-2">{a}</td><td className="px-3 py-2 font-mono text-[13px]">{b}</td><td className="px-3 py-2 text-alloy">{c}</td></tr>)}</tbody>
        </table>
      </div>

      <h2 className="font-display mt-12 text-[24px] font-bold">Subprocessors</h2>
      <p className="mt-2 text-[15px] text-alloy">Providers that process customer data on our behalf. List dated 2026-10-25.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse bg-white text-[14.5px]">
          <thead><tr className="bg-ink text-paper"><th scope="col" className="px-3 py-2 text-left font-medium">Provider</th><th scope="col" className="px-3 py-2 text-left font-medium">Purpose</th><th scope="col" className="px-3 py-2 text-left font-medium">Region</th></tr></thead>
          <tbody>{SUBPROCESSORS.map(([a, b, c]) => <tr key={a} className="border-t border-s100"><td className="px-3 py-2">{a}</td><td className="px-3 py-2 text-alloy">{b}</td><td className="px-3 py-2 text-alloy">{c}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-10 text-[15px]">See also <Link href="/limits" className="font-medium underline underline-offset-2">what Arzen does not do</Link>.</p>
    </div>
  );
}
