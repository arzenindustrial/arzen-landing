"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { isoDate } from "@/lib/format";
import type { Insights } from "@/lib/types";

const RANGES = [[3, "3 months"], [6, "6 months"], [12, "12 months"]] as const;
const pct = (r: number | null) => (r == null ? "—" : `${Math.round(r * 100)} %`);

/** Barra apilada: desviación / revisión / dentro de límites. Lleva los números al lado; el color no va solo. */
function Stack({ flagged, review, total, max }: { flagged: number; review: number; total: number; max: number }) {
  const w = (n: number) => `${(n / (max || 1)) * 100}%`;
  return (
    <span aria-hidden className="flex h-2.5 w-full overflow-hidden rounded-[1px] bg-surface2">
      <span className="h-full bg-dev" style={{ width: w(flagged) }} />
      <span className="h-full bg-warn" style={{ width: w(review) }} />
      <span className="h-full bg-pass" style={{ width: w(total - flagged - review) }} />
    </span>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="num mt-1.5 text-[26px] font-medium leading-none">{value}</p>
      {sub && <p className="mt-1.5 text-[12.5px] text-muted">{sub}</p>}
    </div>
  );
}

export default function InsightsPage() {
  const [months, setMonths] = useState<number>(6);
  const [data, setData] = useState<Insights | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setData(null);
    client.insights(months).then(setData).catch((e) => setErr(e.message));
  }, [months]);

  const section = "rounded-md border border-line bg-surface";
  const th = "px-3 py-2 text-left font-medium text-muted";
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold">Insights</h1>
          <p className="mt-1 text-[14px] text-muted">Where deviations come from: by mill, specification and property.</p>
        </div>
        <div role="group" aria-label="Period" className="flex gap-1">
          {RANGES.map(([m, l]) => (
            <button key={m} onClick={() => setMonths(m)} aria-pressed={months === m}
              className={`rounded border px-3 py-1.5 text-[13.5px] ${months === m ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}>{l}</button>
          ))}
        </div>
      </div>
      {err && <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-4 py-3 text-dev">{err}</p>}
      {!data && !err && <p className="text-muted">Loading…</p>}
      {data && data.totals.total === 0 && (
        <p className={`${section} px-4 py-10 text-center text-muted`}>No certificates in this period yet. <Link href="/app" className="text-fg underline underline-offset-2">Upload an MTR</Link>.</p>
      )}
      {data && data.totals.total > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile label="Certificates" value={String(data.totals.total)} sub={`${data.totals.heats} heats · ${data.totals.mills} mills`} />
            <Tile label="Out of spec" value={String(data.totals.flagged)} sub={`${pct(data.totals.deviation_rate)} of certificates`} />
            <Tile label="Needs review" value={String(data.totals.review)} sub={`${pct(data.totals.review_rate)} of certificates`} />
            <Tile label="Within limits" value={String(data.totals.passed)} sub="Only against verified limits" />
          </div>

          <section className={`${section} p-5`} aria-labelledby="h-month">
            <h2 id="h-month" className="text-[17px] font-semibold">By month</h2>
            <ul className="mt-4 space-y-3">
              {data.monthly.map((m) => (
                <li key={m.period} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-[13px]">
                  <span className="num text-muted">{m.period}</span>
                  <Stack flagged={m.flagged} review={m.review} total={m.total} max={Math.max(...data.monthly.map((x) => x.total))} />
                  <span className="num whitespace-nowrap text-muted">▲ {m.flagged} · ● {m.review} · ✓ {m.passed}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] text-muted">▲ out of spec · ● needs review · ✓ within limits</p>
          </section>

          <section className={section} aria-labelledby="h-mills">
            <h2 id="h-mills" className="px-5 pt-5 text-[17px] font-semibold">Mills</h2>
            <p className="px-5 pt-1 text-[13px] text-muted">Share of each mill&apos;s certificates that came in out of specification.</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-[13.5px]">
                <thead><tr className="border-y border-line"><th scope="col" className={`${th} pl-5`}>Mill</th><th scope="col" className={th}>Certificates</th><th scope="col" className={th}>Out of spec</th><th scope="col" className={`${th} w-[30%]`}>Mix</th><th scope="col" className={`${th} pr-5`}>Last seen</th></tr></thead>
                <tbody>
                  {data.mills.map((m) => (
                    <tr key={m.mill} className="border-t border-line">
                      <th scope="row" className="px-3 py-2.5 pl-5 text-left font-medium">
                        <Link href={`/app/certificates?q=${encodeURIComponent(m.mill.split(" (")[0])}`} className="underline-offset-2 hover:underline">{m.mill}</Link>
                      </th>
                      <td className="num px-3 py-2.5">{m.certs}</td>
                      <td className="num px-3 py-2.5">{m.flagged} <span className="text-muted">· {pct(m.deviation_rate)}</span></td>
                      <td className="px-3 py-2.5"><Stack flagged={m.flagged} review={m.review} total={m.certs} max={m.certs} /></td>
                      <td className="num px-3 py-2.5 pr-5 text-muted">{m.last_seen ? isoDate(m.last_seen) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className={`${section} p-5`} aria-labelledby="h-props">
              <h2 id="h-props" className="text-[17px] font-semibold">Properties that fail or need review</h2>
              {data.properties.length === 0 ? <p className="mt-3 text-[14px] text-muted">No property was out of limits or uncertain in this period.</p> : (
                <ul className="mt-3 divide-y divide-line text-[13.5px]">
                  {data.properties.map((p) => (
                    <li key={p.property} className="flex items-center justify-between gap-3 py-2">
                      <span>{p.property} <span className="font-mono text-[11px] text-muted">{p.category}</span></span>
                      <span className="num whitespace-nowrap">{p.deviations > 0 && <span className="text-dev">▲ {p.deviations}</span>}{p.deviations > 0 && p.reviews > 0 && " · "}{p.reviews > 0 && <span className="text-warn">● {p.reviews}</span>}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className={`${section} p-5`} aria-labelledby="h-specs">
              <h2 id="h-specs" className="text-[17px] font-semibold">Specifications</h2>
              <ul className="mt-3 divide-y divide-line text-[13.5px]">
                {data.specs.map((s) => (
                  <li key={s.spec} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0 truncate">{s.spec}</span>
                    <span className="num whitespace-nowrap text-muted">{s.certs} cert{s.certs === 1 ? "" : "s"} · ▲ {s.flagged}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-5 text-[14px] font-semibold">Country of melt, as read</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-[13px]">
                {data.countries.map((c) => <li key={c.country} className="rounded-[3px] border border-line px-2 py-1"><span>{c.country}</span> <span className="num text-muted">{c.certs}</span></li>)}
              </ul>
            </section>
          </div>
          <p className="text-[12.5px] text-muted">{data.note}</p>
        </>
      )}
    </div>
  );
}
