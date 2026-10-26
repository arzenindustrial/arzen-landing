"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { PLANS } from "./pricing-cards";

/** Calculadora de plan: solo aritmética con los precios publicados y los números del visitante.
 *  No estima ahorros de Arzen (Registro de afirmaciones del brand book): el costo manual es el que el visitante declara. */

type Plan = (typeof PLANS)[number];

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const monthly = (p: Plan, n: number) => p.price + Math.max(0, n - p.included) * p.overage;

/** Volumen a partir del cual el plan B cuesta menos o igual que el plan A. */
function crossover(a: Plan, b: Plan) {
  for (let n = 0; n <= 5000; n++) if (monthly(b, n) <= monthly(a, n)) return n;
  return null;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-medium">{label}</label>
      {hint && <p className="text-[12.5px] text-alloy">{hint}</p>}
      <div className="mt-2">{children(id)}</div>
    </div>
  );
}

const input = "num rounded-[4px] border border-s300 bg-white px-3 py-2 text-[15px] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20";

export function PlanCalculator() {
  const [mtrs, setMtrs] = useState(80);
  const [users, setUsers] = useState(2);
  const [pro, setPro] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [rate, setRate] = useState("");

  const starter = PLANS.find((p) => p.code === "starter")!;
  const professional = PLANS.find((p) => p.code === "professional")!;
  const cross = crossover(starter, professional);
  const rows = PLANS.map((p) => {
    const why = p.code === "starter" && pro ? "Form 2, PPAP and email-in need Professional"
      : users > p.users ? `${p.name} includes ${p.users} users` : null;
    return { p, cost: monthly(p, mtrs), extra: Math.max(0, mtrs - p.included), why };
  });
  const eligible = rows.filter((r) => !r.why);
  const best = eligible.length ? eligible.reduce((a, b) => (b.cost < a.cost ? b : a)) : null;
  const max = Math.max(...rows.map((r) => r.cost));

  const m = parseFloat(minutes), r = parseFloat(rate);
  const manual = m > 0 && r > 0 ? { hours: (mtrs * m) / 60, cost: (mtrs * m * r) / 60 } : null;

  return (
    <div className="brackets grid overflow-hidden rounded-lg border border-s100 bg-white md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-6 border-b border-s100 p-6 md:border-b-0 md:border-r">
        <Field label="Certificates per month" hint="MTRs your team checks in a typical month.">
          {(id) => (
            <div className="flex items-center gap-3">
              <input id={id} type="range" min={1} max={400} step={1} value={Math.min(mtrs, 400)} onChange={(e) => setMtrs(+e.target.value)}
                className="h-1.5 flex-1 cursor-pointer accent-[var(--blue)]" aria-describedby={`${id}-n`} />
              <input aria-label="Certificates per month" type="number" min={0} max={5000} value={mtrs}
                onChange={(e) => setMtrs(Math.max(0, Math.min(5000, Math.round(+e.target.value || 0))))} className={`${input} w-24 shrink-0 text-right`} id={`${id}-n`} />
            </div>
          )}
        </Field>
        <Field label="People who need access">
          {(id) => (
            <div id={id} role="radiogroup" aria-label="People who need access" className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={users === n} onClick={() => setUsers(n)}
                  className={`num h-9 min-w-[2.5rem] rounded-[4px] border px-2 text-[14px] transition-colors ${users === n ? "border-blue bg-blue text-white" : "border-s300 hover:border-ink"}`}>
                  {n === 6 ? "6+" : n}
                </button>
              ))}
            </div>
          )}
        </Field>
        <label className="flex cursor-pointer items-start gap-3 text-[14px]">
          <input type="checkbox" checked={pro} onChange={(e) => setPro(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--blue)]" />
          <span><span className="font-medium">I need AS9102 Form 2, PPAP sheets or email-in</span><br /><span className="text-alloy">Professional features.</span></span>
        </label>
        <fieldset className="rounded-md bg-paper p-4">
          <legend className="sr-only">Your current manual review (optional)</legend>
          <p className="text-[13px] font-medium">Optional: what manual review costs you today</p>
          <p className="text-[12.5px] text-alloy">Your own numbers. We don&apos;t estimate time saved.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Minutes per MTR">{(id) => <input id={id} type="number" min={0} inputMode="decimal" placeholder="e.g. 20" value={minutes} onChange={(e) => setMinutes(e.target.value)} className={`${input} w-full`} />}</Field>
            <Field label="Cost per hour (USD)">{(id) => <input id={id} type="number" min={0} inputMode="decimal" placeholder="e.g. 45" value={rate} onChange={(e) => setRate(e.target.value)} className={`${input} w-full`} />}</Field>
          </div>
        </fieldset>
      </div>

      <div className="p-6" aria-live="polite">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-alloy">Monthly cost at {mtrs} MTRs</p>
        <ul className="mt-4 space-y-4">
          {rows.map(({ p, cost, extra, why }) => {
            const isBest = best?.p.code === p.code;
            return (
              <li key={p.code} className={`rounded-md border p-4 transition-colors ${isBest ? "border-blue bg-infobg/40" : "border-s100"} ${why ? "opacity-60" : ""}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex items-center gap-2 font-semibold">{p.name}{isBest && <span className="rounded-[3px] bg-blue px-1.5 py-0.5 font-mono text-[10.5px] font-normal text-white">BEST FIT</span>}</span>
                  <span className="num text-[22px] font-medium">{usd(cost)}<span className="text-[13px] text-alloy">/mo</span></span>
                </div>
                <span aria-hidden className="mt-2.5 block h-1.5 overflow-hidden rounded-[1px] bg-s100">
                  <span className={`block h-full transition-[width] duration-500 ${isBest ? "bg-blue" : "bg-s300"}`} style={{ width: `${(cost / max) * 100}%` }} />
                </span>
                <p className="num mt-2 text-[12.5px] text-alloy">
                  {usd(p.price)} base{extra > 0 ? ` + ${extra} × ${usd(p.overage)} over ${p.included}` : ` · ${p.included - mtrs} of ${p.included} included left`}
                </p>
                {why && <p className="mt-1 text-[12.5px] text-alloy">Not a fit: {why}.</p>}
              </li>
            );
          })}
        </ul>
        {users > 5 && (
          <p className="mt-4 rounded-md border-l-4 border-blue bg-infobg px-3 py-2 text-[13.5px]">
            More than 5 people? <Link href="/contact" className="font-medium text-blue underline underline-offset-2">Tell us about your team</Link>.
          </p>
        )}
        {cross != null && <p className="mt-4 text-[13px] text-alloy">From {cross} certificates a month, Professional costs the same as Starter or less.</p>}
        {manual && (
          <div className="mt-4 rounded-md bg-ink p-4 text-paper">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-s300">Your manual review today</p>
            <p className="num mt-1 text-[20px]">{manual.hours.toLocaleString("en-US", { maximumFractionDigits: 1 })} h · {usd(Math.round(manual.cost))}<span className="text-[13px] text-s300">/mo</span></p>
            <p className="mt-1 text-[12.5px] text-s300">{mtrs} MTRs × {m} min × {usd(r)}/h, from the numbers you entered.</p>
          </div>
        )}
      </div>
    </div>
  );
}
