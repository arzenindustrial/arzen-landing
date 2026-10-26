"use client";
import { useState } from "react";
import { RangeBar } from "./range-bar";
import { ResultBadge } from "./status";
import { demoDocs } from "@/lib/demo";
import type { Check } from "@/lib/types";

/** Vista previa interactiva del dashboard (modo oscuro del brand book §07/§14): elige un valor y ve
 *  de dónde salió en la página, con qué confianza se leyó y qué regla fija decidió el resultado. */

const DOC = demoDocs[0];
const TABS = [
  { key: "chemistry", label: "Chemistry" },
  { key: "mechanical", label: "Mechanical" },
] as const;

function firstNumber(s?: string | null) {
  return s?.match(/[\d.]+/)?.[0] ?? "";
}

function Snippet({ c }: { c: Check }) {
  const text = c.source?.snippet ?? "";
  const n = firstNumber(c.measured);
  const i = n ? text.indexOf(n) : -1;
  if (i < 0) return <>{text || "—"}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="relative bg-transparent text-ink">
        <span key={c.property} className="hx-box absolute -inset-x-[3px] -inset-y-[2px] rounded-[2px] border-[1.5px] border-blue bg-blue/10" style={{ ["--t" as string]: "0ms" }} />
        <span className="relative font-semibold">{n}</span>
      </mark>
      {text.slice(i + n.length)}
    </>
  );
}

/** Resistencias en MPa (el motor convierte ksi → MPa); lo demás tal como se leyó. */
function shown(c: Check) {
  return /strength/.test(c.property) && c.measured_value != null ? `${c.measured_value} MPa` : c.measured;
}

function rule(c: Check) {
  if (!c.requirement) return null;
  const verb = c.result === "PASS" ? "within" : c.result === "DEVIATION" ? "outside" : "not decided against";
  return `${shown(c)} is ${verb} ${c.requirement}`;
}

export function ProductPreview() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("chemistry");
  const rows = DOC.validation.checks.filter((c) => c.category === tab);
  const [sel, setSel] = useState<string>("Fe");
  const c = rows.find((r) => r.property === sel) ?? rows[0];

  return (
    <div className="app-shell overflow-hidden rounded-lg border border-white/10 bg-surface text-fg shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]" data-theme="dark">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#121C28] px-4 py-2.5">
        <p className="num truncate text-[12px] text-muted">{DOC.original_filename} · {DOC.validation.spec_label}</p>
        <div role="tablist" aria-label="Check category" className="flex gap-1 rounded-[4px] bg-surface2 p-0.5">
          {TABS.map((t) => (
            <button key={t.key} role="tab" type="button" aria-selected={tab === t.key}
              onClick={() => { setTab(t.key); setSel(t.key === "chemistry" ? "Fe" : "tensile_strength"); }}
              className={`rounded-[3px] px-3 py-1 text-[12.5px] font-medium transition-colors ${tab === t.key ? "bg-blue text-white" : "text-muted hover:text-fg"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <ul role="tabpanel" aria-label={`${tab} values`} className="divide-y divide-line">
          {rows.map((r) => {
            const active = r.property === c?.property;
            return (
              <li key={r.property}>
                <button type="button" onClick={() => setSel(r.property)} aria-pressed={active}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_5.4rem_5.8rem] items-center gap-x-3 px-4 py-2.5 text-left text-[13px] transition-colors sm:grid-cols-[minmax(0,1fr)_5.6rem_84px_5.8rem] ${active ? "bg-surface2 shadow-[inset_3px_0_0_var(--blue)]" : "hover:bg-surface2/60"}`}>
                  <span className="truncate">{r.label}</span>
                  <span className="num text-right">{shown(r)}</span>
                  <RangeBar className="hidden sm:block" value={r.measured_value} requirement={r.requirement} result={r.result} dark />
                  <span className="justify-self-start"><ResultBadge compact result={r.result} /></span>
                </button>
              </li>
            );
          })}
        </ul>
        {c && (
          <div className="border-t border-line bg-[#121C28] p-5 lg:border-l lg:border-t-0" aria-live="polite">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Evidence</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[17px] font-semibold">{c.label}</h3>
              <ResultBadge result={c.result} suffix={c.result === "DEVIATION" && c.delta ? `+${c.delta.toFixed(2)}` : undefined} />
            </div>
            <div className="mt-4 overflow-hidden rounded-[3px] bg-[#FBFAF6] p-3 font-mono text-[11.5px] leading-relaxed text-s500">
              <p className="mb-1 text-[10px] text-s300">PAGE {c.source?.page ?? "—"} · ORIGINAL FILE</p>
              <p className="whitespace-pre-wrap break-words"><Snippet c={c} /></p>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
              <dt className="text-muted">Read</dt><dd className="num">{c.measured}</dd>
              <dt className="text-muted">Limit</dt><dd className="num">{c.requirement ?? "—"}</dd>
              <dt className="text-muted">Confidence</dt>
              <dd className="flex items-center gap-2">
                <span className="relative h-1.5 w-24 overflow-hidden rounded-[1px] bg-surface2"><span className="absolute inset-y-0 left-0 bg-[var(--blue)] transition-[width] duration-500" style={{ width: `${Math.round((c.confidence ?? 0) * 100)}%` }} /></span>
                <span className="num">{Math.round((c.confidence ?? 0) * 100)} %</span>
              </dd>
              <dt className="text-muted">Rule</dt><dd className="num text-[12.5px]">{rule(c) ?? "—"}</dd>
            </dl>
            <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">
              The model only transcribed the number. Fixed code compared it with the limit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
