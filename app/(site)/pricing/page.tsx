import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PlanCalculator } from "@/components/plan-calculator";
import { PRICING_NOTES, PricingCards } from "@/components/pricing-cards";
import { SectionHead } from "@/components/home-sections";
import { isDemo } from "@/lib/demo";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing",
  description: "Starter $249/month for up to 60 MTRs. Professional $399/month for up to 200 MTRs with AS9102 Form 2, PPAP and email-in.",
};

const ROWS: [string, string, string][] = [
  ["MTRs included per month", "60", "200"],
  ["Each additional MTR", "$3.50", "$2.50"],
  ["Users", "2", "5"],
  ["Chemistry, mechanical and hardness checks", "Yes", "Yes"],
  ["MTR audit summary (PDF)", "Yes", "Yes"],
  ["AS9102 Form 2 layout", "—", "Yes"],
  ["PPAP material test results", "—", "Yes"],
  ["Forward certificates by email", "—", "Yes"],
  ["API keys", "Yes", "Yes"],
  ["Support", "Email", "Priority"],
];

export default function Pricing() {
  return (
    <>
    <PageHero tag="Pricing" title="Two plans. No call needed."
      lead={isDemo()
        ? "Monthly, by card, no implementation project. Accounts are opening in stages: request early access from any plan."
        : "Pay by card and start the same day. Compare the monthly price with the hours your team spends checking certificates by hand."} />
    <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
      <div data-reveal><PricingCards /></div>
      <section className="mt-20">
        <SectionHead tag="Plan calculator" title="Which plan fits your volume?" lead="Move the slider to your monthly certificate count. Overage is priced per certificate, so the math is simple." />
        <div data-reveal className="mt-8"><PlanCalculator /></div>
      </section>
      <div data-reveal className="mt-14 overflow-x-auto rounded-md border border-s100">
        <table className="w-full min-w-[520px] border-collapse bg-white text-[14.5px]">
          <caption className="sr-only">Plan comparison</caption>
          <thead><tr className="bg-ink text-paper"><th scope="col" className="px-4 py-2.5 text-left font-medium">Feature</th><th scope="col" className="px-4 py-2.5 text-left font-medium">Starter</th><th scope="col" className="px-4 py-2.5 text-left font-medium">Professional</th></tr></thead>
          <tbody>
            {ROWS.map(([f, a, b]) => (
              <tr key={f} className="border-t border-s100 transition-colors hover:bg-paper"><th scope="row" className="px-4 py-2.5 text-left font-normal">{f}</th><td className="num px-4 py-2.5">{a}</td><td className="num px-4 py-2.5">{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 space-y-1 text-[13.5px] text-alloy">{PRICING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
    </>
  );
}
