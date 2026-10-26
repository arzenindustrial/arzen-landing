import type { Counts, Result, Status } from "@/lib/types";

// El color nunca es el único portador del resultado: ícono + palabra + color (brand book §07).
const R: Record<Result, { icon: string; word: string; cls: string }> = {
  PASS: { icon: "✓", word: "PASS", cls: "bg-passbg text-pass" },
  DEVIATION: { icon: "▲", word: "DEVIATION", cls: "bg-devbg text-dev" },
  REVIEW: { icon: "●", word: "REVIEW", cls: "bg-warnbg text-warn" },
};

export function ResultBadge({ result, suffix, compact = false }: { result: Result; suffix?: string; compact?: boolean }) {
  const r = R[result];
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-[3px] font-mono font-medium ${compact ? "gap-1 px-1.5 text-[10.5px]" : "gap-1.5 px-2 py-0.5 text-[12px]"} ${r.cls}`}>
      <span aria-hidden>{r.icon}</span>
      {r.word}
      {suffix && <span className="opacity-80">{suffix}</span>}
    </span>
  );
}

const S: Record<Status, Result> = { PASSED: "PASS", FLAGGED_OUT_OF_SPEC: "DEVIATION", REQUIRES_REVIEW: "REVIEW" };
const SW: Record<Status, string> = { PASSED: "WITHIN LIMITS", FLAGGED_OUT_OF_SPEC: "OUT OF SPEC", REQUIRES_REVIEW: "NEEDS REVIEW" };

export function StatusBadge({ status }: { status: Status }) {
  const r = R[S[status]];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[3px] px-2 py-0.5 font-mono text-[12px] font-medium ${r.cls}`}>
      <span aria-hidden>{r.icon}</span>
      {SW[status]}
    </span>
  );
}

/** "▲ 1 DEVIATION · ✓ 14 PASS · ● 1 REVIEW" — lo primero visible (Result first, brand book §14). */
export function CountsLine({ counts, size = "md", hideZero = false }: { counts: Counts; size?: "md" | "lg"; hideZero?: boolean }) {
  const cls = size === "lg" ? "text-[15px] px-2.5 py-1" : "text-[12px] px-2 py-0.5";
  return (
    <div className="flex flex-wrap gap-2" aria-label={`${counts.deviation} deviation, ${counts.pass} pass, ${counts.review} review`}>
      {(["DEVIATION", "PASS", "REVIEW"] as Result[]).map((k) => {
        const n = k === "DEVIATION" ? counts.deviation : k === "PASS" ? counts.pass : counts.review;
        if (hideZero && !n) return null;
        return (
          <span key={k} className={`inline-flex items-center gap-1.5 rounded-[3px] font-mono font-medium ${cls} ${R[k].cls}`}>
            <span aria-hidden>{R[k].icon}</span>
            {n} {R[k].word}
          </span>
        );
      })}
    </div>
  );
}
