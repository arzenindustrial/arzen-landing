"use client";
import Link from "next/link";
import { useState } from "react";
import { Dropzone } from "@/components/dropzone";
import { ResultBadge, StatusBadge } from "@/components/status";
import { API_URL } from "@/lib/api";
import { demoDocs } from "@/lib/demo";
import { INDUSTRY_LABEL } from "@/lib/format";
import type { FreeCheckResult, Industry } from "@/lib/types";

function demoResult(): FreeCheckResult {
  const d = demoDocs[0];
  const chem = d.validation.checks.filter((c) => c.category === "chemistry");
  return {
    status: d.validation_status, spec_label: d.validation.spec_label ?? null, spec_status: d.validation.spec_status ?? null,
    heat_detected: true, processing_ms: 0, stored: false, demo: true,
    upgrade: "Values, limits, mechanical checks, the audit PDF and FAIR export need an account.",
    chemistry: { pass: chem.filter((c) => c.result === "PASS").length, deviation: chem.filter((c) => c.result === "DEVIATION").length,
      review: chem.filter((c) => c.result === "REVIEW").length, elements: chem.map((c) => ({ element: c.property, label: c.label, result: c.result })) },
  };
}

export function FreeCheck() {
  const [industry, setIndustry] = useState<Industry | "">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FreeCheckResult | null>(null);

  async function run(files: File[]) {
    setError(null);
    setResult(null);
    if (!API_URL) {
      setResult(demoResult());
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", files[0]);
      if (industry) fd.append("industry", industry);
      const res = await fetch(`${API_URL}/v1/free-check`, { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(typeof j.detail === "string" ? j.detail : "We couldn't check this file. Try again.");
      setResult(j);
    } catch (e: any) {
      setError(e.message || "We couldn't reach Arzen. Check your connection and retry.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-3 block text-[14.5px]">
        <span className="font-medium">Industry</span> <span className="text-alloy">(optional, narrows the specification match)</span>
        <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)}
          className="mt-1.5 block w-full rounded border border-s300 bg-white px-3 py-2 sm:w-72">
          <option value="">Any industry</option>
          {Object.entries(INDUSTRY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <Dropzone onFiles={run} busy={busy} busyText="Reading the certificate and checking each element…" />
      {error && (
        <p role="alert" className="mt-4 rounded border-l-4 border-dev bg-devbg px-4 py-3 text-[15px] text-dev">{error}</p>
      )}
      {result && (
        <div className="mt-6 rounded-lg border border-s300 bg-white p-5 sm:p-6" aria-live="polite">
          {result.demo && (
            <p className="mb-4 rounded border-l-4 border-blue bg-infobg px-3 py-2 text-[14px]">
              Demo: this site isn't connected to the Arzen API yet, so this is the result for our sample certificate, not your file.
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold">Chemistry summary</h2>
            <StatusBadge status={result.status} />
          </div>
          <p className="num mt-1 text-[13px] text-alloy">
            {result.spec_label ? `Specification matched: ${result.spec_label}` : "No specification matched. With an account you can pick it or add your own."}
          </p>
          {result.spec_status === "draft_unverified" && (
            <p className="mt-3 rounded border-l-4 border-warn bg-warnbg px-3 py-2 text-[13.5px] text-warn">
              These limits are a draft not yet verified against the licensed standard, so the result cannot read “within limits” yet.
            </p>
          )}
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.chemistry.elements.map((e) => (
              <li key={e.element} className="flex items-center justify-between rounded border border-s100 px-3 py-2">
                <span>{e.label}</span><ResultBadge result={e.result} />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 border-t border-s100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14.5px] text-alloy">{result.upgrade}</p>
            <Link href="/pricing" className="shrink-0 rounded bg-blue px-4 py-2.5 text-center font-medium text-white">See plans</Link>
          </div>
        </div>
      )}
    </div>
  );
}
