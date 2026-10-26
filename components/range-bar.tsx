import type { Result } from "@/lib/types";
import { rangeGeometry } from "@/lib/motion";

/** Barra de rango (brand book §09): banda gris = permitido, marca = valor medido. Fuera de rango en Deviation.
 *  `animate` hace que la marca viaje desde la izquierda empezando en `t` ms (animación del hero). */
export function RangeBar({ value, requirement, result, className = "", animate, t = 0, dark = false }: {
  value?: number | null; requirement?: string | null; result: Result; className?: string; animate?: boolean; t?: number; dark?: boolean;
}) {
  const g = rangeGeometry(value, requirement);
  if (!g) return <span className={`block h-2 ${className}`} aria-hidden />;
  const mark = result === "DEVIATION" ? "bg-dev" : result === "REVIEW" ? "bg-warn" : dark ? "bg-paper" : "bg-ink";
  return (
    <span aria-hidden className={`relative block h-2.5 ${className}`}>
      <span className={`absolute inset-y-[3px] left-0 right-0 rounded-[1px] ${dark ? "bg-white/10" : "bg-s100"}`} />
      <span className={`absolute inset-y-[1px] rounded-[1px] ${dark ? "bg-white/25" : "bg-s300"}`} style={{ left: `${g.band[0]}%`, width: `${g.band[1] - g.band[0]}%` }} />
      <span
        className={`absolute -top-[2px] h-[14px] w-[3px] -translate-x-1/2 rounded-[1px] ${mark} ${animate ? "hx-mark" : ""}`}
        style={{ left: `${g.x}%`, ["--x" as string]: `${g.x}%`, ["--t" as string]: `${t}ms` }}
      />
    </span>
  );
}
