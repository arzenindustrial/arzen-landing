import sample from "./sample-data.json";
import type { CertDocument, DocSummary, Insights, Me, Spec } from "./types";

// Modo demo: el dashboard muestra resultados reales del motor sobre MTR sintéticos (rotulados "Sample data").
// Excepción de desarrollo: API local con token fijo (NEXT_PUBLIC_DEV_TOKEN), para probar el recorrido real sin Supabase.
const DEV_LOCAL = !!process.env.NEXT_PUBLIC_DEV_TOKEN && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(process.env.NEXT_PUBLIC_API_URL || "");
export const isDemo = (): boolean =>
  !DEV_LOCAL && (process.env.NEXT_PUBLIC_DEMO === "1" || !process.env.NEXT_PUBLIC_SUPABASE_URL);

export const demoDocs = sample.documents as unknown as CertDocument[];
export const demoCatalog = sample.catalog as unknown as Spec[];

export function demoSummaries(): DocSummary[] {
  return demoDocs.map((d) => ({
    id: d.id, original_filename: d.original_filename, ingest_channel: d.ingest_channel ?? "web",
    industry_sector: d.industry_sector ?? "aerospace", heat_number: d.heat_number, mill_name: d.mill_name,
    validation_status: d.validation_status, spec_code: d.spec?.spec_code, alloy: d.spec?.alloy_designation,
    spec_revision: d.spec?.spec_revision, processed_at: d.processed_at, counts: d.validation.counts,
  }));
}

export const demoMe: Me = {
  user_id: "demo", email: "qa@sample-shop.example", kind: "user",
  organization: {
    id: "demo-org", name: "Sample Machining (fictitious)", role: "owner", plan: "professional",
    subscription_status: "active",
    features: { pdf_conformance_report: true, fair_form2: true, ppap: true, email_ingest: true, priority_support: true, api_keys: true },
    default_industry: "aerospace", low_confidence_threshold: 0.9, current_period_end: null,
    inbound_email: "3f9c2a7e1b0d4c55a8e6f7d2@in.arzen.example",
    usage: { period: "2026-10", used: demoDocs.length, included: 200, overage: 0, overage_usd_cents: 0 },
    notify_prefs: { deviation: true, review: false, email_ingest: true, usage: true, weekly_digest: true, billing: true },
    notify_emails: [], melt_countries: [],
  },
};

/** Misma agregación que GET /v1/insights, calculada sobre los certificados de muestra. */
export function demoInsights(months = 6): Insights {
  const docs = demoDocs;
  const rate = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 1000 : null);
  const flagged = (d: CertDocument) => d.validation_status === "FLAGGED_OUT_OF_SPEC";
  const review = (d: CertDocument) => d.validation_status === "REQUIRES_REVIEW";
  const group = <K extends string>(key: (d: CertDocument) => K) => {
    const m = new Map<K, CertDocument[]>();
    for (const d of docs) m.set(key(d), [...(m.get(key(d)) || []), d]);
    return [...m.entries()];
  };
  const props = new Map<string, { property: string; category: string; deviations: number; reviews: number }>();
  for (const d of docs) for (const c of d.validation.checks) {
    if (!["chemistry", "mechanical", "hardness"].includes(c.category) || c.result === "PASS") continue;
    const p = props.get(c.label) || { property: c.label, category: c.category, deviations: 0, reviews: 0 };
    if (c.result === "DEVIATION") p.deviations++; else p.reviews++;
    props.set(c.label, p);
  }
  return {
    months,
    totals: {
      total: docs.length, passed: docs.filter((d) => d.validation_status === "PASSED").length, flagged: docs.filter(flagged).length,
      review: docs.filter(review).length, heats: new Set(docs.map((d) => d.heat_number.toLowerCase())).size,
      mills: new Set(docs.map((d) => (d.mill_name || "").toLowerCase())).size,
      deviation_rate: rate(docs.filter(flagged).length, docs.length), review_rate: rate(docs.filter(review).length, docs.length),
    },
    monthly: group((d) => d.processed_at.slice(0, 7)).map(([period, ds]) => ({
      period, total: ds.length, passed: ds.filter((d) => d.validation_status === "PASSED").length, flagged: ds.filter(flagged).length, review: ds.filter(review).length,
    })).sort((a, b) => a.period.localeCompare(b.period)),
    mills: group((d) => d.mill_name || "Not read").map(([mill, ds]) => ({
      mill, certs: ds.length, flagged: ds.filter(flagged).length, review: ds.filter(review).length, deviation_rate: rate(ds.filter(flagged).length, ds.length),
      last_seen: ds.map((d) => d.processed_at).sort().at(-1) || null,
    })).sort((a, b) => b.flagged - a.flagged || b.certs - a.certs),
    specs: group((d) => d.validation.spec_label || "Not matched").map(([spec, ds]) => ({
      spec, certs: ds.length, flagged: ds.filter(flagged).length, deviation_rate: rate(ds.filter(flagged).length, ds.length),
    })).sort((a, b) => b.certs - a.certs),
    properties: [...props.values()].sort((a, b) => b.deviations - a.deviations || b.reviews - a.reviews).slice(0, 15),
    countries: group((d) => d.country_of_melt || "Not stated").map(([country, ds]) => ({ country, certs: ds.length })).sort((a, b) => b.certs - a.certs),
    note: "Counts of results already decided by the engine. A mill with few certificates is not a trend.",
  };
}
