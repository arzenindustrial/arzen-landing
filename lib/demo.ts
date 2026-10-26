import sample from "./sample-data.json";
import type { CertDocument, DocSummary, Me, Spec } from "./types";

// Modo demo: el dashboard muestra resultados reales del motor sobre MTR sintéticos (rotulados "Sample data").
export const isDemo = (): boolean =>
  process.env.NEXT_PUBLIC_DEMO === "1" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

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
    usage: { period: "2026-10", used: 3, included: 200, overage: 0, overage_usd_cents: 0 },
  },
};
