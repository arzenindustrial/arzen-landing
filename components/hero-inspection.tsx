"use client";
import { useEffect, useRef, useState } from "react";
import { IconExport } from "./icons";
import { RangeBar } from "./range-bar";
import { ResultBadge } from "./status";
import { demoDocs } from "@/lib/demo";
import { at } from "@/lib/motion";
import { shortHash } from "@/lib/format";

/** «Messy in, clean out» animado (brand book §09): el MTR resaltado a mano se escanea, cada valor se encierra
 *  donde aparece en la página y cae a la tabla del producto, donde reglas fijas lo comparan con el límite.
 *  Datos reales del motor sobre un certificado sintético. Todo con CSS: sin JS se ve completo; "Replay" lo repite. */

const DOC = demoDocs[0];
const PICK = ["Al", "V", "Fe", "O", "H", "tensile_strength", "yield_strength"];
const ROWS = PICK.map((p) => DOC.validation.checks.find((c) => c.property === p)!).filter(Boolean);
const SHORT: Record<string, string> = { tensile_strength: "Tensile", yield_strength: "Yield 0.2 %" };
const KSI: Record<string, string> = { tensile_strength: "131.3 ksi", yield_strength: "120.4 ksi" };

const SCAN_START = 500, SCAN_LEN = 1900;
const ROW_START = 2500, ROW_STEP = 230;
const DONE = ROW_START + ROW_STEP * ROWS.length + 450;
/** Momento en que la línea de lectura pasa por una fracción vertical del documento. */
const scanAt = (y: number) => Math.round(SCAN_START + SCAN_LEN * y);

function Box({ y, children, hl = false }: { y: number; children: React.ReactNode; hl?: boolean }) {
  return (
    <span className={`relative inline-block ${hl ? "bg-[#FFE45C]/80 text-ink" : ""}`}>
      {children}
      <span aria-hidden className="hx-box pointer-events-none absolute -inset-x-[3px] -inset-y-[1.5px] rounded-[2px] border-[1.5px] border-blue" style={at(scanAt(y))} />
    </span>
  );
}

export function HeroInspection() {
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLElement>(null);
  // Si al cargar el banco está fuera de pantalla (móvil), la animación se reinicia cuando aparece.
  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRun((n) => n + 1); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const counts = { pass: ROWS.filter((r) => r.result === "PASS").length, deviation: ROWS.filter((r) => r.result === "DEVIATION").length };
  return (
    <figure ref={ref} className="relative" aria-label="Animation: a scanned mill certificate is read value by value and checked against the specification. Iron 0.27 % against a limit of 0.25 % is flagged as a deviation. Sample data.">
      <div key={run} aria-hidden className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-8">
        {/* Lado «sucio»: el certificado tal como llega */}
        <div className="hx-in relative mx-auto w-full max-w-[340px] lg:max-w-none" style={at(0)}>
          <div className="relative -rotate-[2.5deg] overflow-hidden rounded-[3px] bg-[#FBFAF6] p-4 font-mono text-[10.5px] leading-[1.75] text-s500 shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)]">
            <div className="flex justify-between text-[10px]"><span className="font-semibold tracking-wide text-alloy">MILL TEST REPORT</span><span>p 1/1</span></div>
            <p className="truncate">Sample Titanium Mill (fictitious)</p>
            <p className="mt-1 whitespace-nowrap">Heat No: <Box y={0.2}>0Y7K-2291</Box></p>
            <p className="whitespace-nowrap">Spec: <Box y={0.27}>ASTM F136</Box> · Bar 1.000 in</p>
            <p className="mt-1.5 border-b border-dashed border-s300 text-[9.5px] tracking-wide text-alloy">CHEMICAL ANALYSIS, wt %</p>
            <div className="grid grid-cols-5 gap-x-1.5 whitespace-nowrap">
              <span>Al</span><span>V</span><span>Fe</span><span>O</span><span>H</span>
              <Box y={0.5}>6.10</Box><Box y={0.5}>4.00</Box><Box y={0.5} hl>0.27</Box><Box y={0.5}>0.11</Box><Box y={0.5}>.0045</Box>
            </div>
            <p className="mt-1.5 border-b border-dashed border-s300 text-[9.5px] tracking-wide text-alloy">MECHANICAL</p>
            <p className="whitespace-nowrap">Tensile: <Box y={0.74} hl>131.3 ksi</Box></p>
            <p className="whitespace-nowrap">Yield (0.2%): <Box y={0.83}>120.4 ksi</Box></p>
            <p className="whitespace-nowrap">Elong. 4D: 14 %&nbsp; RA: 38 %</p>
            <p className="mt-2 text-right text-[9.5px] italic text-s300">QA ✓ ___ ?</p>
            {/* Línea de lectura: barre el documento una vez */}
            <div className="hx-beam pointer-events-none absolute inset-x-0 h-0">
              <div className="absolute inset-x-0 bottom-0 h-8 bg-blue/10" />
              <div className="absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 bg-blue" />
            </div>
          </div>
        </div>

        {/* Lado «limpio»: la UI del producto */}
        <div className="hx-in overflow-hidden rounded-md border border-white/10 bg-white text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,.7)]" style={at(150)}>
          <div className="flex items-center justify-between gap-3 bg-[#16212E] px-3 py-2 font-mono text-[10.5px] text-s300">
            <span className="truncate">{DOC.spec?.alloy_designation} · Heat {DOC.heat_number}</span>
            <span className="relative flex h-4 w-[92px] shrink-0 items-center justify-end">
              <span className="hx-phase absolute inset-0 flex items-center justify-end gap-1.5 text-[var(--blue-on-ink)]" style={at(SCAN_START - 100, { ["--len" as string]: `${ROW_START - SCAN_START}ms` })}>
                <span className="blink h-1.5 w-1.5 bg-[var(--blue-on-ink)]" />READING
              </span>
              <span className="hx-phase absolute inset-0 flex items-center justify-end gap-1.5 text-[var(--blue-on-ink)]" style={at(ROW_START, { ["--len" as string]: `${DONE - ROW_START}ms` })}>
                <span className="blink h-1.5 w-1.5 bg-[var(--blue-on-ink)]" />CHECKING
              </span>
              <span className="hx-show absolute inset-0 flex items-center justify-end gap-1.5 text-paper" style={at(DONE)}>
                <span className="h-1.5 w-1.5 bg-[var(--blue-on-ink)]" />DONE
              </span>
            </span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_4.4rem_5.3rem_5.4rem] gap-x-2 border-b border-s100 px-3 py-1.5 sm:gap-x-3 text-[10.5px] font-medium uppercase tracking-wide text-alloy sm:grid-cols-[minmax(0,1fr)_4.8rem_5.6rem_64px_5.6rem]">
            <span>Property</span><span className="text-right">Value</span><span className="text-right">Limit</span><span className="hidden sm:block">Range</span><span>Result</span>
          </div>
          <ul>
            {ROWS.map((r, i) => {
              const t = ROW_START + i * ROW_STEP;
              const dev = r.result === "DEVIATION";
              return (
                <li key={r.property} className={`hx-row relative isolate grid grid-cols-[minmax(0,1fr)_4.4rem_5.3rem_5.4rem] items-center gap-x-2 border-b border-s100 px-3 py-[7px] sm:gap-x-3 text-[12.5px] last:border-0 sm:grid-cols-[minmax(0,1fr)_4.8rem_5.6rem_64px_5.6rem] ${dev ? "bg-devbg shadow-[inset_3px_0_0_var(--dev)]" : ""}`} style={at(t)}>
                  {dev && <span className="hx-flash absolute inset-0 -z-10 bg-[#F4C9C9]" style={at(DONE)} />}
                  <span className="truncate font-medium">
                    {SHORT[r.property] ?? r.property}
                    {KSI[r.property] && <span className="ml-1.5 hidden font-mono sm:inline text-[10.5px] font-normal text-alloy">{KSI[r.property]} →</span>}
                  </span>
                  <span className="num text-right">{r.measured_value != null && r.category === "mechanical" ? `${r.measured_value} MPa` : r.measured}</span>
                  <span className="num whitespace-nowrap text-right text-alloy">{r.requirement}</span>
                  <RangeBar className="hidden w-16 sm:block" value={r.measured_value} requirement={r.requirement} result={r.result} animate t={t + 100} />
                  <span className="hx-stamp justify-self-start" style={at(t + 450)}><ResultBadge compact result={r.result} /></span>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-s100 bg-paper px-3 py-2.5">
            <span className="hx-in flex gap-1.5" style={at(DONE)}>
              <ResultBadge compact result="DEVIATION" suffix={`× ${counts.deviation}`} />
              <ResultBadge compact result="PASS" suffix={`× ${counts.pass}`} />
            </span>
            <span className="hx-in inline-flex items-center gap-1.5 rounded-[3px] border border-s300 bg-white px-2 py-1 font-mono text-[10.5px] text-ink" style={at(DONE + 400)}>
              <IconExport size={13} className="text-blue" /> audit-summary.pdf · {shortHash(DOC.file_sha256, 8)}…
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-3 font-mono text-[11px] text-s300">
        <span>Sample data · synthetic certificate · draft limits</span>
        <button key={`r${run}`} type="button" onClick={() => setRun((n) => n + 1)}
          className="hx-show inline-flex items-center gap-1.5 rounded-[3px] border border-white/20 px-2 py-1 text-paper hover:border-white/50"
          style={at(DONE + 600)}>
          <span aria-hidden>↻</span> Replay
        </button>
      </figcaption>
    </figure>
  );
}
