"use client";
import Link from "next/link";
import { useState } from "react";

/** Formulario de acceso anticipado. Guarda el lead en la API con el texto de consentimiento y su fecha.
 *  Solo se monta cuando NEXT_PUBLIC_LEAD_FORM=1 y la API está conectada (ver contact/page.tsx). */
export const LEAD_CONSENT = "I agree that Arzen may contact me about this request.";

export function LeadForm() {
  const [f, setF] = useState({ email: "", name: "", company: "", role: "", country: "", mtrs_per_month: "", specs: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setState("busy");
    try {
      // fetch directo: este formulario es público y no necesita el cliente del dashboard (Supabase, datos de demo).
      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")}/v1/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(Object.entries(f).filter(([, v]) => v !== "")),
          mtrs_per_month: f.mtrs_per_month ? Number(f.mtrs_per_month) : undefined, consent, topic: "early_access",
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(typeof j.detail === "string" ? j.detail : "We couldn't send your request. Please try again or email us.");
      }
      setState("done");
    } catch (x: any) {
      setErr(x.message);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-md border border-s100 bg-white p-6">
        <h2 className="text-[19px] font-semibold">Request received</h2>
        <p className="mt-2 text-[15px] text-alloy">We&apos;ll write back to {f.email} with next steps. Meanwhile you can try the <Link href="/check" className="font-medium text-ink underline underline-offset-2">free MTR check</Link>.</p>
      </div>
    );
  }
  const input = "mt-1 w-full rounded-[4px] border border-s300 bg-white px-3 py-2 text-[15px] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20";
  const label = "block text-[14px] font-medium";
  return (
    <form onSubmit={submit} className="rounded-md border border-s100 bg-white p-6" aria-labelledby="h-lead">
      <h2 id="h-lead" className="text-[19px] font-semibold">Request early access</h2>
      <p className="mt-1 text-[14.5px] text-alloy">Tell us about your shop. Don&apos;t attach certificates or drawings.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className={label}>Work email<input className={input} type="email" required maxLength={254} autoComplete="email" value={f.email} onChange={set("email")} /></label>
        <label className={label}>Name<input className={input} maxLength={120} autoComplete="name" value={f.name} onChange={set("name")} /></label>
        <label className={label}>Company<input className={input} maxLength={160} autoComplete="organization" value={f.company} onChange={set("company")} /></label>
        <label className={label}>Your role<input className={input} maxLength={120} placeholder="Quality manager, owner…" value={f.role} onChange={set("role")} /></label>
        <label className={label}>Country
          <select className={input} value={f.country} onChange={set("country")}><option value="">Select</option><option value="US">United States</option><option value="MX">Mexico</option><option value="CA">Canada</option><option value="Other">Other</option></select>
        </label>
        <label className={label}>Certificates (MTRs) per month<input className={input} type="number" min={0} max={100000} inputMode="numeric" value={f.mtrs_per_month} onChange={set("mtrs_per_month")} /></label>
        <label className={`${label} sm:col-span-2`}>Specifications you check most<input className={input} maxLength={400} placeholder="ASTM F136, AMS 4928, API 6A…" value={f.specs} onChange={set("specs")} /></label>
        <label className={`${label} sm:col-span-2`}>Anything else<textarea className={input} rows={3} maxLength={2000} value={f.message} onChange={set("message")} /></label>
        {/* Campo trampa para bots: fuera de la vista y del orden de tabulación. */}
        <label className="absolute left-[-9999px]" aria-hidden>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} /></label>
      </div>
      <label className="mt-5 flex items-start gap-3 text-[14px]">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--blue)]" />
        <span>{LEAD_CONSENT} <Link href="/trust" className="underline underline-offset-2">How Arzen handles data</Link>.</span>
      </label>
      {err && <p role="alert" className="mt-4 rounded border-l-4 border-dev bg-devbg px-3 py-2 text-[14px] text-dev">{err}</p>}
      <button disabled={state === "busy"} className="mt-5 inline-flex items-center gap-2 rounded bg-blue px-5 py-3 font-medium text-white transition-colors hover:bg-[#1c43bb] disabled:opacity-60">
        {state === "busy" ? "Sending…" : "Request early access"}
      </button>
    </form>
  );
}
