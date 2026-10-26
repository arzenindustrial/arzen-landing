/** Símbolo "The Scan Line" y lockup. Geometría idéntica a brand/assets/*.svg (no recrear: brand book §17). */
export function Symbol({ size = 28, reversed = false, adaptive = false, title }: { size?: number; reversed?: boolean; adaptive?: boolean; title?: string }) {
  const a = reversed ? "#F6F4EF" : adaptive ? "var(--fg)" : "#0E1621";
  const line = reversed ? "#6F93FF" : adaptive ? "var(--blue)" : "#2350D9";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M8 42 L24 6 L40 42 H32.5 L24 22 L15.5 42 Z" fill={a} />
      <rect className="scan-line" x="3" y="29" width="42" height="3.2" fill={line} />
    </svg>
  );
}

export function Logo({ reversed = false, descriptor = false, adaptive = false }: { reversed?: boolean; descriptor?: boolean; adaptive?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Symbol size={30} reversed={reversed} adaptive={adaptive} />
      <span className="flex flex-col leading-none">
        <span className={`wordmark text-[19px] ${reversed ? "text-paper" : adaptive ? "text-fg" : "text-ink"}`}>ARZEN</span>
        {descriptor && (
          <span className={`mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] ${reversed ? "text-s300" : "text-alloy"}`}>
            Quality automation
          </span>
        )}
      </span>
    </span>
  );
}
