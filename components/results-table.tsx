import type { Check } from "@/lib/types";
import { ResultBadge } from "./status";

function source(c: Check) {
  const s = c.source;
  if (!s || (!s.page && !s.row)) return "—";
  return [s.page ? `p${s.page}` : null, s.row ? `r${s.row}` : null].filter(Boolean).join(" · ");
}

function delta(c: Check) {
  if (c.result !== "DEVIATION" || c.delta == null) return undefined;
  const d = Math.abs(c.delta) < 1 ? c.delta.toFixed(Math.max(2, String(c.delta).split(".")[1]?.length ?? 2)) : c.delta.toFixed(1);
  return (c.delta > 0 ? "+" : "−") + d.replace("-", "");
}

/** Tabla de resultados: valores en mono alineados, requisito con la norma, evidencia al lado (brand book §14). */
export function ResultsTable({ checks, onConfirm, onSelectSource, selected, dark = false }: {
  checks: Check[]; onConfirm?: (c: Check) => void; onSelectSource?: (c: Check, index: number) => void; selected?: number | null; dark?: boolean;
}) {
  const head = dark ? "bg-surface2 text-paper" : "bg-ink text-paper";
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
        <thead>
          <tr className={head}>
            <th scope="col" className="px-3 py-2 text-left font-medium">Property</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">Measured</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">Requirement</th>
            <th scope="col" className="px-3 py-2 text-left font-medium">Result</th>
            <th scope="col" className="px-3 py-2 text-left font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c, i) => {
            const row = c.result === "DEVIATION" ? "bg-devbg" : c.result === "REVIEW" ? "bg-warnbg/60" : "bg-surface";
            const isSel = selected === i;
            return (
              <tr key={`${c.property}-${i}`} className={`${row} border-t border-line align-top ${isSel ? "outline outline-2 -outline-offset-2 outline-[var(--blue)]" : ""}`}>
                <td className="px-3 py-2.5">
                  <div className="font-medium">{c.label}</div>
                  {c.reason && <div className="mt-0.5 max-w-[46ch] text-[12.5px] leading-snug text-muted">{c.reason}</div>}
                  {onConfirm && c.result === "REVIEW" && c.category !== "specification" && (
                    <button type="button" onClick={() => onConfirm(c)}
                      className="mt-1.5 text-[12.5px] font-medium text-blue underline underline-offset-2">
                      Confirm from the original
                    </button>
                  )}
                </td>
                <td className="num px-3 py-2.5 text-right">{c.measured ?? "—"}</td>
                <td className="num whitespace-nowrap px-3 py-2.5 text-right text-muted">{c.requirement ?? "—"}</td>
                <td className="px-3 py-2.5"><ResultBadge result={c.result} suffix={delta(c)} /></td>
                <td className="num px-3 py-2.5 text-muted">
                  {onSelectSource && c.source?.page ? (
                    <button type="button" onClick={() => onSelectSource(c, i)} aria-pressed={isSel}
                      aria-label={`Show ${c.label} on the original, ${source(c)}`}
                      className="whitespace-nowrap rounded px-1 text-blue underline underline-offset-2">{source(c)}</button>
                  ) : source(c)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
