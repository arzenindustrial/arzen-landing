"use client";
import { useEffect, useState } from "react";
import { CertTable } from "@/components/cert-table";
import { client } from "@/lib/client";
import type { DocSummary } from "@/lib/types";

const STATUSES = [["", "All"], ["FLAGGED_OUT_OF_SPEC", "Out of spec"], ["REQUIRES_REVIEW", "Needs review"], ["PASSED", "Within limits"]];
const MAX_BINDER = 50;

export default function Certificates() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState<{ items: DocSummary[]; total: number } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [info, setInfo] = useState({ customer: "", po_number: "", part_number: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("q");   // enlaces desde Insights
    if (fromUrl) return setQ(fromUrl);
    try { const s = JSON.parse(localStorage.getItem("arzen-cert-filters") || "{}"); setQ(s.q || ""); setStatus(s.status || ""); } catch {}
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem("arzen-cert-filters", JSON.stringify({ q, status })); } catch {}
      client.certificates(q, status).then(setData).catch(() => setData({ items: [], total: 0 }));
    }, 200);
    return () => clearTimeout(t);
  }, [q, status]);

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else if (next.size < MAX_BINDER) next.add(id);
    return next;
  });
  async function exportBinder() {
    setBusy(true);
    setMsg(null);
    try {
      await client.binder([...selected], info);
      setMsg(client.demo() ? "Demo mode: this is a sample binder built from three sample certificates." : "Binder downloaded. The export is recorded in the audit trail.");
    } catch (e: any) {
      setMsg(e.message);
    }
    setBusy(false);
  }
  const field = "w-full rounded border border-line bg-surface px-3 py-2 text-[14px]";
  return (
    <div className="space-y-5">
      <h1 className="text-[26px] font-semibold">Certificates</h1>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search heat number, mill, file or specification"
            className="w-full rounded border border-line bg-surface px-3 py-2" />
        </label>
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1">
          {STATUSES.map(([v, l]) => (
            <button key={v} onClick={() => setStatus(v)} aria-pressed={status === v}
              className={`rounded border px-3 py-2 text-[13.5px] ${status === v ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}>{l}</button>
          ))}
        </div>
      </div>
      {selected.size > 0 && (
        <section aria-labelledby="h-binder" className="rounded-md border border-blue bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="h-binder" className="text-[16px] font-semibold">Audit binder · {selected.size} certificate{selected.size === 1 ? "" : "s"}</h2>
            <button onClick={() => setSelected(new Set())} className="text-[13px] text-muted underline underline-offset-2">Clear selection</button>
          </div>
          <p className="mt-1 text-[13px] text-muted">One PDF with a cover, an index and each certificate&apos;s audit summary, in the order selected. Up to {MAX_BINDER}.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <label><span className="sr-only">Customer</span><input className={field} placeholder="Customer (optional)" maxLength={120} value={info.customer} onChange={(e) => setInfo({ ...info, customer: e.target.value })} /></label>
            <label><span className="sr-only">Purchase order</span><input className={field} placeholder="Purchase order (optional)" maxLength={80} value={info.po_number} onChange={(e) => setInfo({ ...info, po_number: e.target.value })} /></label>
            <label><span className="sr-only">Part number</span><input className={field} placeholder="Part number (optional)" maxLength={80} value={info.part_number} onChange={(e) => setInfo({ ...info, part_number: e.target.value })} /></label>
            <button onClick={exportBinder} disabled={busy} className="rounded bg-blue px-4 py-2 font-medium text-white disabled:opacity-60">{busy ? "Building…" : "Export binder"}</button>
          </div>
          {msg && <p role="status" className="mt-3 text-[13.5px]">{msg}</p>}
        </section>
      )}
      {data === null ? <p className="text-muted">Loading…</p> : (
        <>
          <p className="text-[13px] text-muted">{data.total} certificate{data.total === 1 ? "" : "s"}{data.items.length > 0 && selected.size === 0 ? " · tick the ones that ship together to export an audit binder" : ""}</p>
          <CertTable items={data.items} highlight={q.trim() || undefined} selected={selected} onToggle={toggle} />
        </>
      )}
    </div>
  );
}
