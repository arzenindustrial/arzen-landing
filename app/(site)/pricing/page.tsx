import type { Metadata } from "next";
import { PRICING_NOTES, PricingCards } from "@/components/pricing-cards";

export const metadata: Metadata = {
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
    <div className="mx-auto max-w-page px-4 py-14 sm:px-6">
      <h1 className="font-display text-[clamp(34px,5vw,52px)] font-bold">Pricing</h1>
      <p className="mt-3 max-w-2xl text-[17px] text-alloy">Two plans. Pay by card, no call needed. Compare the monthly price with the hours your team spends checking certificates by hand.</p>
      <div className="mt-10"><PricingCards /></div>
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse bg-white text-[14.5px]">
          <caption className="sr-only">Plan comparison</caption>
          <thead><tr className="bg-ink text-paper"><th scope="col" className="px-4 py-2.5 text-left font-medium">Feature</th><th scope="col" className="px-4 py-2.5 text-left font-medium">Starter</th><th scope="col" className="px-4 py-2.5 text-left font-medium">Professional</th></tr></thead>
          <tbody>
            {ROWS.map(([f, a, b]) => (
              <tr key={f} className="border-t border-s100"><th scope="row" className="px-4 py-2.5 text-left font-normal">{f}</th><td className="num px-4 py-2.5">{a}</td><td className="num px-4 py-2.5">{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 space-y-1 text-[13.5px] text-alloy">{PRICING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
  );
}
