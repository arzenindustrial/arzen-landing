import type { Industry, Status } from "./types";

export const INDUSTRY_LABEL: Record<Industry, string> = {
  aerospace: "Aerospace & Defense",
  medical: "Medical Devices",
  oil_gas: "Oil, Gas & Energy",
  automotive: "Automotive & EV",
};

export const STATUS_TEXT: Record<Status, string> = {
  PASSED: "Within limits",
  FLAGGED_OUT_OF_SPEC: "Out of spec",
  REQUIRES_REVIEW: "Needs review",
};

/** Marketing: "Oct 25, 2026". Documentos y tablas: ISO "2026-10-25" (brand book §17). */
export function isoDate(s: string): string {
  return s.slice(0, 10);
}
export function isoDateTime(s: string): string {
  const d = new Date(s);
  return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)} UTC`;
}
export function usd(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
export function shortHash(h: string, n = 12): string {
  return (h || "").slice(0, n);
}
