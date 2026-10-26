"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand";
import { ResultsTable } from "@/components/results-table";
import { CountsLine, StatusBadge } from "@/components/status";
import { API_URL } from "@/lib/api";
import { isoDateTime } from "@/lib/format";
import type { Check, Counts, Status } from "@/lib/types";

interface Report {
  report_no: string; issued_by: string; heat_number: string; alloy: string | null; status: Status; counts: Counts;
  spec_label: string | null; spec_status: string | null; checks: Check[]; notes: string[]; file_sha256: string;
  result_sha256: string; engine_version: string; processed_at: string;
}

/** Reporte público de solo lectura (brand book §15). Lo ve el cliente del cliente: sobrio, sin publicidad. */
export function PublicReport({ token }: { token: string }) {
  const [r, setR] = useState<Report | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!API_URL) { setErr("This report isn't available."); return; }
    fetch(`${API_URL}/v1/public/reports/${encodeURIComponent(token)}`)
      .then(async (res) => { if (!res.ok) throw new Error("This report link is not valid, or the owner turned it off."); setR(await res.json()); })
      .catch((e) => setErr(e.message));
  }, [token]);
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-s100 bg-white">
        <div className="mx-auto flex max-w-page items-center justify-between px-4 py-4 sm:px-6">
          <Logo descriptor />
          <span className="font-mono text-[12px] text-alloy">{r ? `Report ${r.report_no}` : ""}</span>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-page px-4 py-10 sm:px-6">
        {err && <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-4 py-3 text-dev">{err}</p>}
        {!r && !err && <p className="text-alloy">Loading…</p>}
        {r && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-alloy">MTR audit summary · issued by {r.issued_by}</p>
                <h1 className="font-display mt-2 text-[clamp(28px,4vw,40px)] font-bold">{r.alloy || "Material"} · Heat <span className="num">{r.heat_number}</span></h1>
                <p className="num mt-1 text-[13px] text-alloy">{r.spec_label || "Specification not matched"} · processed {isoDateTime(r.processed_at)}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <CountsLine counts={r.counts} size="lg" />
            {r.spec_status === "draft_unverified" && (
              <p className="rounded border-l-4 border-warn bg-warnbg px-4 py-2.5 text-[14px] text-warn">The specification limits used were a draft, not verified against the licensed standard.</p>
            )}
            <ResultsTable checks={r.checks} />
            {r.notes.length > 0 && (
              <section><h2 className="text-[16px] font-semibold">What was not checked</h2>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[14px] text-alloy">{r.notes.map((n) => <li key={n}>{n}</li>)}</ul></section>
            )}
            <dl className="grid gap-x-4 gap-y-1 rounded-md border border-s100 bg-white p-4 text-[13px] sm:grid-cols-[auto_1fr]">
              <dt className="text-alloy">Source file SHA-256</dt><dd className="num break-all">{r.file_sha256}</dd>
              <dt className="text-alloy">Result SHA-256</dt><dd className="num break-all">{r.result_sha256}</dd>
              <dt className="text-alloy">Engine</dt><dd className="num">{r.engine_version}</dd>
            </dl>
            <p className="text-[13px] text-alloy">
              Values were read from the source document and checked by fixed rules against the limits shown. Arzen does not approve or certify material; release remains with {r.issued_by}. To compare a file you hold, compute its SHA-256 and match it above.
            </p>
          </div>
        )}
        <p className="mt-12 text-[12.5px] text-alloy">Verified with <Link href="/" className="underline">Arzen</Link>. Arzen is a product of Arzen Industrial Group.</p>
      </main>
    </div>
  );
}
