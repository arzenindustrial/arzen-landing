import type { CSSProperties } from "react";

/** Retraso escalonado para listas que aparecen al hacer scroll: style={stagger(i)}. */
export const stagger = (i: number, step = 80, base = 0) => ({ ["--d" as string]: `${base + i * step}ms` }) as CSSProperties;

/** Inicio de una pieza de la animación del hero, en milisegundos: style={at(1200)}. */
export const at = (ms: number, extra: Record<string, string> = {}) => ({ ["--t" as string]: `${ms}ms`, ...extra }) as CSSProperties;

/** Geometría de una barra de rango (bullet chart, brand book §09) a partir del requisito "≤ 0.25 %", "5.50–6.50 %", "≥ 860 MPa". */
export function rangeGeometry(value: number | null | undefined, requirement: string | null | undefined) {
  if (value == null || !requirement) return null;
  const nums = (requirement.match(/[\d.]+/g) || []).map(Number).filter((n) => !Number.isNaN(n));
  let min: number | undefined, max: number | undefined;
  if (/[–-]/.test(requirement) && nums.length >= 2) [min, max] = nums;
  else if (requirement.includes("≤") || requirement.includes("<")) max = nums[0];
  else if (requirement.includes("≥") || requirement.includes(">")) min = nums[0];
  if (min == null && max == null) return null;
  let lo: number, hi: number;
  if (min != null && max != null) { const w = max - min; lo = min - w * 0.6; hi = max + w * 0.6; }
  else if (max != null) { lo = 0; hi = Math.max(max * 1.45, value * 1.1); }
  else { lo = min! * 0.75; hi = Math.max(min! * 1.3, value * 1.08); }
  const pct = (n: number) => Math.min(100, Math.max(0, ((n - lo) / (hi - lo)) * 100));
  return { band: [pct(min ?? lo), pct(max ?? hi)] as [number, number], x: pct(value) };
}
