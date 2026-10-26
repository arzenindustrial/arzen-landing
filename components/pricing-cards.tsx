import Link from "next/link";

// Blueprint §3. Límites y precios viven en la tabla `plans` (editable sin deploy); aquí la vista pública.
export const PLANS = [
  {
    code: "starter", name: "Starter", price: 249, audience: "Small shops, 5–15 machines",
    items: ["Up to 60 MTRs validated per month", "Chemistry and mechanical checks", "2 users",
            "PDF conformance report per certificate", "$3.50 per additional MTR"],
  },
  {
    code: "professional", name: "Professional", price: 399, audience: "The quality team's plan", featured: true,
    items: ["Up to 200 MTRs per month", "AS9102 Form 2 and PPAP material sheets", "Email-in: forward certs to your own address",
            "5 users, priority support", "$2.50 per additional MTR"],
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {PLANS.map((p) => {
        const f = p.featured;
        return (
          <div key={p.code} className={`card-lift relative flex flex-col overflow-hidden rounded-lg border p-7 ${f ? "border-ink bg-ink text-paper" : "border-s300 bg-white"}`}>
            {f && <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-60" />}
            <div className="relative flex items-baseline justify-between">
              <h3 className="font-display text-[24px] font-bold">{p.name}</h3>
              {f && <span className="rounded-[3px] bg-blue px-2 py-0.5 font-mono text-[11px] text-white">RECOMMENDED</span>}
            </div>
            <p className={`relative mt-1 text-[14px] ${f ? "text-s300" : "text-alloy"}`}>{p.audience}</p>
            <p className="relative mt-6 flex items-baseline gap-1"><span className="num text-[48px] font-medium leading-none tracking-tight">${p.price}</span><span className={f ? "text-s300" : "text-alloy"}>/month</span></p>
            <ul className="relative mt-6 flex-1 space-y-3 text-[15px]">
              {p.items.map((i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className={`mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] ${f ? "bg-white/10 text-[var(--blue-on-ink)]" : "bg-infobg text-blue"}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square"><path d="M2 5.2 4.2 7.4 8 3" /></svg>
                  </span>
                  {i}
                </li>
              ))}
            </ul>
            <Link href={`/signup?plan=${p.code}`}
              className={`group relative mt-7 inline-flex items-center justify-center gap-2 rounded px-4 py-3 text-center font-medium transition-colors ${f ? "bg-blue text-white hover:bg-[#1c43bb]" : "border border-ink text-ink hover:bg-ink hover:text-paper"}`}>
              Start {p.name} <span aria-hidden className="arrow">→</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export const PRICING_NOTES = [
  "Billed monthly by card through Stripe. No annual contract and no implementation fee.",
  "Usage is counted per certificate processed. A file you upload twice is counted once.",
  "Prices in USD. Taxes may apply depending on your location.",
];
