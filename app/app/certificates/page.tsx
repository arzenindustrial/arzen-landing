"use client";
import { useEffect, useState } from "react";
import { CertTable } from "@/components/cert-table";
import { client } from "@/lib/client";
import type { DocSummary } from "@/lib/types";

const STATUSES = [["", "All"], ["FLAGGED_OUT_OF_SPEC", "Out of spec"], ["REQUIRES_REVIEW", "Needs review"], ["PASSED", "Within limits"]];

export default function Certificates() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState<{ items: DocSummary[]; total: number } | null>(null);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("arzen-cert-filters") || "{}"); setQ(s.q || ""); setStatus(s.status || ""); } catch {}
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem("arzen-cert-filters", JSON.stringify({ q, status })); } catch {}
      client.certificates(q, status).then(setData).catch(() => setData({ items: [], total: 0 }));
    }, 200);
    return () => clearTimeout(t);
  }, [q, status]);
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
      {data === null ? <p className="text-muted">Loading…</p> : (
        <>
          <p className="text-[13px] text-muted">{data.total} certificate{data.total === 1 ? "" : "s"}</p>
          <CertTable items={data.items} highlight={q.trim() || undefined} />
        </>
      )}
    </div>
  );
}
