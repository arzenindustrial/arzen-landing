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
      {PLANS.map((p) => (
        <div key={p.code} className={`flex flex-col rounded-lg border bg-white p-6 ${p.featured ? "border-ink ring-1 ring-ink" : "border-s300"}`}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[22px] font-bold">{p.name}</h3>
            {p.featured && <span className="rounded-[3px] bg-ink px-2 py-0.5 font-mono text-[11px] text-paper">RECOMMENDED</span>}
          </div>
          <p className="mt-1 text-[14px] text-alloy">{p.audience}</p>
          <p className="mt-5"><span className="num text-[40px] font-medium leading-none">${p.price}</span><span className="text-alloy"> /month</span></p>
          <ul className="mt-5 flex-1 space-y-2.5 text-[15px]">
            {p.items.map((i) => <li key={i} className="flex gap-2"><span aria-hidden className="mt-[9px] h-[2px] w-3 shrink-0 bg-ink" />{i}</li>)}
          </ul>
          <Link href={`/signup?plan=${p.code}`}
            className={`mt-6 rounded px-4 py-2.5 text-center font-medium ${p.featured ? "bg-blue text-white hover:bg-[#1c43bb]" : "border border-ink text-ink hover:bg-paper"}`}>
            Start {p.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export const PRICING_NOTES = [
  "Billed monthly by card through Stripe. No annual contract and no implementation fee.",
  "Usage is counted per certificate processed. A file you upload twice is counted once.",
  "Prices in USD. Taxes may apply depending on your location.",
];
