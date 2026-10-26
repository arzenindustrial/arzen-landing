"use client";
import { useEffect, useState } from "react";
import { useMe } from "@/components/app-shell";
import { client } from "@/lib/client";
import { INDUSTRY_LABEL } from "@/lib/format";
import type { Industry, Spec } from "@/lib/types";

function limits(s: Spec) {
  return Object.entries(s.chemical_limits).map(([el, l]) =>
    l.min != null && l.max != null ? `${el} ${l.min}–${l.max}` : l.max != null ? `${el} ≤${l.max}` : `${el} ≥${l.min}`).join(" · ");
}

export default function Specs() {
  const { me } = useMe();
  const [industry, setIndustry] = useState<Industry | "">((me?.organization?.default_industry as Industry) || "");
  const [specs, setSpecs] = useState<Spec[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  useEffect(() => { client.specs(industry).then(setSpecs).catch(() => setSpecs([])); }, [industry, adding]);
  const admin = ["owner", "admin"].includes(me?.organization?.role || "");
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[26px] font-semibold">Specifications</h1>
        {admin && <button onClick={() => setAdding((x) => !x)} className="rounded border border-fg px-4 py-2 font-medium">{adding ? "Close" : "Add your own"}</button>}
      </div>
      <p className="max-w-3xl text-[14.5px] text-muted">
        The industry selector loads a catalog; the checking engine is the same for all four. Arzen's starter catalog is a draft being verified against the licensed standards, so results against it read “needs review”. Limits you add and mark as verified by a named person can produce “within limits”.
      </p>
      {adding && <AddSpec onDone={() => setAdding(false)} />}
      <div role="group" aria-label="Industry" className="flex flex-wrap gap-1">
        {([["", "All"], ...Object.entries(INDUSTRY_LABEL)] as [string, string][]).map(([k, l]) => (
          <button key={k} onClick={() => setIndustry(k as Industry | "")} aria-pressed={industry === k}
            className={`rounded border px-3 py-1.5 text-[13.5px] ${industry === k ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}>{l}</button>
        ))}
      </div>
      {specs === null ? <p className="text-muted">Loading…</p> : (
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[720px] border-collapse bg-surface text-[13.5px]">
            <thead><tr className="border-b border-line text-left text-muted">
              <th scope="col" className="px-3 py-2 font-medium">Specification</th><th scope="col" className="px-3 py-2 font-medium">Material</th>
              <th scope="col" className="px-3 py-2 font-medium">Form</th><th scope="col" className="px-3 py-2 font-medium">Source</th><th scope="col" className="px-3 py-2 font-medium">Limits</th>
            </tr></thead>
            <tbody>
              {specs.map((s) => {
                const key = `${s.id}-${s.spec_code}-${s.alloy_designation}`;
                return (
                  <tr key={key} className="border-t border-line align-top">
                    <td className="num px-3 py-2">{s.spec_code}{s.spec_revision ? `-${s.spec_revision}` : ""}</td>
                    <td className="px-3 py-2">{s.alloy_designation}</td>
                    <td className="px-3 py-2 text-muted">{s.product_form || "—"}</td>
                    <td className="px-3 py-2">
                      {s.limits_status === "verified"
                        ? <span className="rounded-[3px] bg-passbg px-2 py-0.5 font-mono text-[11.5px] text-pass">✓ VERIFIED</span>
                        : <span className="rounded-[3px] bg-warnbg px-2 py-0.5 font-mono text-[11.5px] text-warn">● DRAFT</span>}
                      <div className="mt-1 text-[12px] text-muted">{s.organization_id ? "Your organization" : "Arzen catalog"}</div>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => setOpen(open === key ? null : key)} className="text-[13px] underline underline-offset-2" aria-expanded={open === key}>
                        {open === key ? "Hide" : "Show"}
                      </button>
                      {open === key && (
                        <div className="num mt-2 max-w-md space-y-1 text-[12.5px] text-muted">
                          <p>{limits(s)}</p>
                          {Object.keys(s.mechanical_limits).length > 0 && <p>{Object.entries(s.mechanical_limits).map(([k, v]) => `${k.replace(/_/g, " ")} ${v}`).join(" · ")}</p>}
                          {s.hardness_limits && <p>hardness {JSON.stringify(s.hardness_limits)}</p>}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddSpec({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState({ industry_sector: "aerospace", spec_code: "", spec_revision: "", alloy_designation: "", product_form: "",
    chem: "Al 5.50-6.50\nV 3.50-4.50\nFe <=0.25", tensile: "", yield_: "", elong: "", verified_by: "" });
  const [err, setErr] = useState<string | null>(null);
  function parseChem(text: string) {
    const out: Record<string, { min?: number; max?: number }> = {};
    for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
      const m = line.match(/^([A-Z][a-z]?)\s+(?:(\d*\.?\d+)\s*-\s*(\d*\.?\d+)|<=?\s*(\d*\.?\d+)|>=?\s*(\d*\.?\d+))$/);
      if (!m) throw new Error(`Couldn't read “${line}”. Use “Fe <=0.25”, “Al 5.50-6.50” or “Mg >=0.80”.`);
      out[m[1]] = m[2] ? { min: +m[2], max: +m[3] } : m[4] ? { max: +m[4] } : { min: +m[5] };
    }
    return out;
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const mech: Record<string, number> = {};
      if (f.tensile) mech.tensile_min_mpa = +f.tensile;
      if (f.yield_) mech.yield_min_mpa = +f.yield_;
      if (f.elong) mech.elongation_min = +f.elong;
      await client.addSpec({ industry_sector: f.industry_sector, spec_code: f.spec_code, spec_revision: f.spec_revision || null,
        alloy_designation: f.alloy_designation, product_form: f.product_form || null, chemical_limits: parseChem(f.chem),
        mechanical_limits: mech, verified_by: f.verified_by || null });
      onDone();
    } catch (x: any) { setErr(x.message); }
  }
  const input = "mt-1 w-full rounded border border-line bg-surface px-2.5 py-1.5";
  return (
    <form onSubmit={save} className="grid gap-3 rounded-md border border-line bg-surface p-5 sm:grid-cols-2">
      <label className="text-[13.5px]">Industry
        <select value={f.industry_sector} onChange={(e) => setF({ ...f, industry_sector: e.target.value })} className={input}>
          {Object.entries(INDUSTRY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="text-[13.5px]">Specification code<input required value={f.spec_code} onChange={(e) => setF({ ...f, spec_code: e.target.value })} className={input} placeholder="ACME-MS-136" /></label>
      <label className="text-[13.5px]">Revision<input value={f.spec_revision} onChange={(e) => setF({ ...f, spec_revision: e.target.value })} className={input} /></label>
      <label className="text-[13.5px]">Material / alloy<input required value={f.alloy_designation} onChange={(e) => setF({ ...f, alloy_designation: e.target.value })} className={input} /></label>
      <label className="text-[13.5px]">Product form and size<input value={f.product_form} onChange={(e) => setF({ ...f, product_form: e.target.value })} className={input} /></label>
      <label className="text-[13.5px] sm:row-span-2">Chemistry limits, % (one element per line)
        <textarea value={f.chem} onChange={(e) => setF({ ...f, chem: e.target.value })} rows={5} className={`${input} num`} />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-[13.5px]">Tensile ≥ MPa<input inputMode="decimal" value={f.tensile} onChange={(e) => setF({ ...f, tensile: e.target.value })} className={input} /></label>
        <label className="text-[13.5px]">Yield ≥ MPa<input inputMode="decimal" value={f.yield_} onChange={(e) => setF({ ...f, yield_: e.target.value })} className={input} /></label>
        <label className="text-[13.5px]">Elong. ≥ %<input inputMode="decimal" value={f.elong} onChange={(e) => setF({ ...f, elong: e.target.value })} className={input} /></label>
      </div>
      <label className="text-[13.5px] sm:col-span-2">Verified by (name and role)
        <input value={f.verified_by} onChange={(e) => setF({ ...f, verified_by: e.target.value })} className={input} placeholder="Leave empty to keep it as a draft" />
        <span className="mt-1 block text-[12px] text-muted">Only fill this if a named person compared these limits with the current edition of the specification.</span>
      </label>
      {err && <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-3 py-2 text-[14px] text-dev sm:col-span-2">{err}</p>}
      <div className="sm:col-span-2"><button className="rounded bg-blue px-4 py-2 font-medium text-white">Save specification</button></div>
    </form>
  );
}
