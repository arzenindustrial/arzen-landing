"use client";
import { useCallback, useEffect, useState } from "react";
import { useMe } from "@/components/app-shell";
import { client } from "@/lib/client";
import { isoDate } from "@/lib/format";
import type { Lead, OpsAccount, OpsHealth, OpsMetrics, Prospect } from "@/lib/types";

/** Panel interno de Arzen. La API solo responde a usuarios de staff (ARZEN_STAFF_USER_IDS); esta pantalla no
 *  concede nada por sí misma. Los datos de contacto que aparecen aquí son personales: no copiarlos a reportes. */

const TABS = ["Overview", "Accounts", "Leads", "Prospects"] as const;
const LEVEL = { ok: ["✓", "text-pass"], warn: ["!", "text-warn"], fail: ["✗", "text-dev"] } as const;
const LEAD_STATUS = ["new", "contacted", "qualified", "converted", "discarded"];
const PROSPECT_STATUS = ["new", "researched", "qualified", "approved_for_outreach", "contacted", "customer", "disqualified"];
/** Solo enlaces http(s): los sitios vienen de listas importadas y no deben poder ejecutar código (javascript:). */
const safeUrl = (u?: string | null) => { try { const x = new URL(u || ""); return /^https?:$/.test(x.protocol) ? x.href : null; } catch { return null; } };
const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const pct = (r: number | null) => (r == null ? "—" : `${Math.round(r * 100)} %`);

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="num mt-1.5 text-[24px] font-medium leading-none">{value}</p>
      {sub && <p className="mt-1.5 text-[12.5px] text-muted">{sub}</p>}
    </div>
  );
}

function Score({ n, reasons }: { n: number | null; reasons: { points: number; reason: string }[] }) {
  const tone = (n ?? 0) >= 60 ? "border-blue text-blue" : "border-line text-muted";
  return (
    <details className="relative">
      <summary className={`num inline-flex cursor-pointer list-none rounded-[3px] border px-1.5 py-0.5 text-[12px] ${tone}`}>{n ?? "—"}</summary>
      <ul className="absolute z-10 mt-1 w-72 rounded-md border border-line bg-surface p-3 text-[12.5px] shadow-lg">
        {reasons.length ? reasons.map((r) => <li key={r.reason} className="flex gap-2"><span className="num w-7 shrink-0 text-right text-muted">+{r.points}</span>{r.reason}</li>)
          : <li className="text-muted">No scoring signal found.</li>}
      </ul>
    </details>
  );
}

export default function Admin() {
  const { me } = useMe();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [m, setM] = useState<OpsMetrics | null>(null);
  const [h, setH] = useState<OpsHealth | null>(null);
  const [accounts, setAccounts] = useState<OpsAccount[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [minScore, setMinScore] = useState(30);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      if (tab === "Overview") { const [mm, hh] = await Promise.all([client.ops.metrics(), client.ops.health()]); setM(mm); setH(hh); }
      if (tab === "Accounts") setAccounts(await client.ops.accounts());
      if (tab === "Leads") setLeads((await client.ops.leads()).items);
      if (tab === "Prospects") setProspects((await client.ops.prospects(minScore)).items);
    } catch (e: any) { setErr(e.message); }
  }, [tab, minScore]);
  useEffect(() => { if (me?.staff) load(); }, [me, load]);

  if (!me?.staff) return <p className="rounded-md border border-line bg-surface px-4 py-8 text-center text-muted">This area is for Arzen staff.</p>;
  const th = "px-3 py-2 text-left font-medium text-muted";
  const table = "w-full border-collapse bg-surface text-[13.5px]";
  const select = "rounded border border-line bg-surface px-2 py-1 text-[13px]";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-semibold">Arzen ops</h1>
        <p className="mt-1 text-[14px] text-muted">Internal. Contact details here are personal data: use them to reply, never copy them into reports.</p>
      </div>
      <div role="tablist" aria-label="Operations" className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-[14px] ${tab === t ? "border-blue font-semibold" : "border-transparent text-muted hover:text-fg"}`}>{t}</button>
        ))}
      </div>
      {err && <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-4 py-3 text-dev">{err}</p>}

      {tab === "Overview" && (!m || !h ? <p className="text-muted">Loading…</p> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile label="MRR" value={money(m.revenue.mrr_usd)} sub={`${m.accounts.paying} paying · Stripe ${m.revenue.stripe_mode.replace("_", " ")}`} />
            <Tile label="Overage this month" value={money(m.revenue.overage_this_period_usd)} sub={`${m.revenue.overage_certs} certificates over plan`} />
            <Tile label="Certificates · 30 days" value={String(m.certificates.last_30d)} sub={`${m.certificates.last_24h} in the last 24 h`} />
            <Tile label="Needs review · 30 days" value={pct(m.certificates.review_rate_30d)} sub={`Out of spec ${pct(m.certificates.deviation_rate_30d)}`} />
          </div>
          <section className="rounded-md border border-line bg-surface p-5" aria-labelledby="h-health">
            <h2 id="h-health" className="text-[17px] font-semibold">Health <span className={`ml-2 font-mono text-[12px] ${LEVEL[h.status][1]}`}>{LEVEL[h.status][0]} {h.status.toUpperCase()}</span></h2>
            <ul className="mt-3 divide-y divide-line text-[13.5px]">
              {h.checks.map((c) => (
                <li key={c.id} className="flex flex-wrap gap-x-3 py-2 sm:flex-nowrap">
                  <span className={`w-4 shrink-0 font-mono ${LEVEL[c.level][1]}`} aria-label={c.level}>{LEVEL[c.level][0]}</span>
                  <span className="num shrink-0 text-muted sm:w-44">{c.id}</span>
                  <span className="min-w-0 basis-full break-words pl-7 sm:basis-auto sm:pl-0">{c.detail}</span>
                </li>
              ))}
            </ul>
          </section>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-md border border-line bg-surface p-5" aria-labelledby="h-funnel">
              <h2 id="h-funnel" className="text-[17px] font-semibold">Funnel · last 30 days</h2>
              <ol className="mt-3 space-y-2 text-[14px]">
                {([["Free checks completed", m.funnel_30d.free_checks], ["Accounts created", m.funnel_30d.accounts_created],
                   ["Accounts with a first certificate", m.funnel_30d.accounts_with_first_cert], ["Accounts paying", m.funnel_30d.accounts_paying]] as const).map(([l, n]) => (
                  <li key={l} className="flex items-center justify-between gap-3"><span>{l}</span><span className="num">{n}</span></li>
                ))}
              </ol>
              <p className="mt-3 text-[12.5px] text-muted">Free checks are counted by request, not by person; the steps are not the same cohort.</p>
            </section>
            <section className="rounded-md border border-line bg-surface p-5" aria-labelledby="h-pipe">
              <h2 id="h-pipe" className="text-[17px] font-semibold">Pipeline</h2>
              <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-2 text-[14px]">
                <dt>Leads waiting for a first reply</dt><dd className="num">{m.leads.by_status.new ?? 0}</dd>
                <dt>Leads waiting more than 2 days</dt><dd className="num">{m.leads.waiting_over_2d}</dd>
                <dt>Prospects with a strong fit (60+)</dt><dd className="num">{m.prospects.strong_fit}</dd>
                <dt>Prospects approved for outreach</dt><dd className="num">{m.prospects.by_status.approved_for_outreach ?? 0}</dd>
                <dt>Catalog entries verified</dt><dd className="num">{m.catalog.verified} / {m.catalog.specs}</dd>
                <dt>Paying accounts idle 14 days</dt><dd className="num">{m.accounts.paying_idle_14d}</dd>
              </dl>
            </section>
          </div>
        </div>
      ))}

      {tab === "Accounts" && (accounts === null ? <p className="text-muted">Loading…</p> : (
        <div className="overflow-x-auto rounded-md border border-line">
          <table className={`${table} min-w-[820px]`}>
            <thead><tr className="border-b border-line"><th scope="col" className={th}>Account</th><th scope="col" className={th}>Plan</th><th scope="col" className={th}>Usage this month</th><th scope="col" className={th}>Total</th><th scope="col" className={th}>Last certificate</th><th scope="col" className={th}>Created</th></tr></thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <th scope="row" className="px-3 py-2.5 text-left font-medium">{a.name}<div className="text-[12px] font-normal text-muted">{a.owner_email || "—"} · {a.members} user{a.members === 1 ? "" : "s"}</div></th>
                  <td className="px-3 py-2.5">{a.plan_code || "none"}<div className="font-mono text-[11.5px] text-muted">{a.subscription_status}</div></td>
                  <td className="num px-3 py-2.5">{a.used_this_period} / {a.included}{a.overage_usd > 0 && <span className="text-warn"> · {money(a.overage_usd)} over</span>}</td>
                  <td className="num px-3 py-2.5">{a.certs_total}</td>
                  <td className="num px-3 py-2.5 text-muted">{a.last_cert_at ? isoDate(a.last_cert_at) : "never"}</td>
                  <td className="num px-3 py-2.5 text-muted">{isoDate(a.created_at)}</td>
                </tr>
              ))}
              {!accounts.length && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">No accounts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      ))}

      {tab === "Leads" && (leads === null ? <p className="text-muted">Loading…</p> : (
        <div className="overflow-x-auto rounded-md border border-line">
          <table className={`${table} min-w-[860px]`}>
            <thead><tr className="border-b border-line"><th scope="col" className={th}>Score</th><th scope="col" className={th}>Contact</th><th scope="col" className={th}>Company</th><th scope="col" className={th}>MTRs / month</th><th scope="col" className={th}>Received</th><th scope="col" className={th}>Status</th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-line align-top">
                  <td className="px-3 py-2.5"><Score n={l.score} reasons={l.score_reasons} /></td>
                  <td className="px-3 py-2.5"><a href={`mailto:${l.email}`} className="font-medium text-blue underline-offset-2 hover:underline">{l.email}</a><div className="text-[12px] text-muted">{[l.name, l.role].filter(Boolean).join(" · ") || "—"}</div></td>
                  <td className="px-3 py-2.5">{l.company || "—"}<div className="max-w-xs text-[12px] text-muted">{[l.specs, l.message].filter(Boolean).join(" · ")}</div></td>
                  <td className="num px-3 py-2.5">{l.mtrs_per_month ?? "—"}</td>
                  <td className="num px-3 py-2.5 text-muted">{isoDate(l.created_at)}</td>
                  <td className="px-3 py-2.5">
                    <select aria-label={`Status for ${l.email}`} className={select} value={l.status}
                      onChange={async (e) => { try { await client.ops.patchLead(l.id, { status: e.target.value }); await load(); } catch (x: any) { setErr(x.message); } }}>
                      {LEAD_STATUS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {!leads.length && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">No leads yet. They arrive from the form on the contact page.</td></tr>}
            </tbody>
          </table>
        </div>
      ))}

      {tab === "Prospects" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-[13.5px]">
            <label className="flex items-center gap-2">Minimum fit score
              <select className={select} value={minScore} onChange={(e) => setMinScore(+e.target.value)}>{[0, 30, 60].map((n) => <option key={n} value={n}>{n}</option>)}</select>
            </label>
            <span className="text-muted">Outreach stays closed until gate G3. Marking a company &quot;approved for outreach&quot; records the decision; it sends nothing.</span>
          </div>
          {prospects === null ? <p className="text-muted">Loading…</p> : (
            <div className="overflow-x-auto rounded-md border border-line">
              <table className={`${table} min-w-[900px]`}>
                <thead><tr className="border-b border-line"><th scope="col" className={th}>Fit</th><th scope="col" className={th}>Company</th><th scope="col" className={th}>Declares</th><th scope="col" className={th}>Source</th><th scope="col" className={th}>Status</th><th scope="col" className={th}>Do not contact</th></tr></thead>
                <tbody>
                  {prospects.map((p) => (
                    <tr key={p.id} className="border-t border-line align-top">
                      <td className="px-3 py-2.5"><Score n={p.icp_score} reasons={p.icp_reasons} /></td>
                      <th scope="row" className="px-3 py-2.5 text-left font-medium">{safeUrl(p.website) ? <a href={safeUrl(p.website)!} target="_blank" rel="noreferrer noopener" className="underline-offset-2 hover:underline">{p.company_name}</a> : p.company_name}
                        <div className="text-[12px] font-normal text-muted">{[p.city, p.region, p.country].filter(Boolean).join(", ")}</div></th>
                      <td className="px-3 py-2.5 text-[12.5px]">{[...p.certifications, ...p.industries.map((i) => i.replace("_", " "))].join(" · ") || <span className="text-muted">nothing found</span>}</td>
                      <td className="px-3 py-2.5 font-mono text-[12px] text-muted">{p.source}{p.source_risk && <div className="text-dev">restricted: {p.source_risk}</div>}</td>
                      <td className="px-3 py-2.5">
                        <select aria-label={`Status for ${p.company_name}`} className={select} value={p.status} disabled={p.do_not_contact || !!p.source_risk}
                          onChange={async (e) => { try { await client.ops.patchProspect(p.id, { status: e.target.value }); await load(); } catch (x: any) { setErr(x.message); } }}>
                          {PROSPECT_STATUS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2.5">
                        <input type="checkbox" aria-label={`Do not contact ${p.company_name}`} className="h-4 w-4 accent-[var(--blue)]" checked={p.do_not_contact}
                          onChange={async (e) => { try { await client.ops.patchProspect(p.id, { do_not_contact: e.target.checked }); await load(); } catch (x: any) { setErr(x.message); } }} />
                      </td>
                    </tr>
                  ))}
                  {!prospects.length && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">No prospects at this score. Import a list with scripts/import_prospects.py.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
