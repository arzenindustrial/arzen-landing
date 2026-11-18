export type Result = "PASS" | "DEVIATION" | "REVIEW";
export type Status = "PASSED" | "FLAGGED_OUT_OF_SPEC" | "REQUIRES_REVIEW";
export type Industry = "aerospace" | "medical" | "oil_gas" | "automotive";

export interface SourceRef { page?: number | null; row?: number | null; snippet?: string | null; bbox?: number[] | null }
export interface Check {
  category: "metadata" | "chemistry" | "mechanical" | "hardness" | "specification";
  property: string;
  label: string;
  measured?: string | null;
  measured_value?: number | null;
  requirement?: string | null;
  result: Result;
  reason?: string | null;
  delta?: number | null;
  source?: SourceRef | null;
  confidence?: number | null;
}
export interface Counts { pass: number; deviation: number; review: number }
export interface Spec {
  id?: string | null;
  organization_id?: string | null;
  industry_sector: Industry;
  standard_body: string;
  spec_code: string;
  spec_revision?: string | null;
  alloy_designation: string;
  product_form?: string | null;
  chemical_limits: Record<string, { min?: number; max?: number }>;
  mechanical_limits: Record<string, number | string>;
  hardness_limits?: Record<string, number | string> | null;
  limits_status: "draft_unverified" | "verified" | "retired";
}
export interface Confirmation {
  field_path: string; original_value?: string | null; confirmed_value: string;
  confirmed_by?: string | null; confirmed_by_email?: string | null; confirmed_at: string;
}
export interface CertDocument {
  id: string;
  original_filename: string;
  ingest_channel?: string;
  industry_sector?: Industry;
  file_sha256: string;
  page_count?: number | null;
  heat_number: string;
  mill_name?: string | null;
  country_of_melt?: string | null;
  validation_status: Status;
  validation: {
    status: Status; discrepancies: string[]; checks: Check[]; counts: Counts; notes: string[];
    spec_label?: string | null; spec_status?: string | null; engine_version: string; result_sha256: string;
  };
  extracted_data: Record<string, any>;
  spec?: Spec | null;
  spec_candidates?: Spec[];
  ocr_engine: string;
  normalizer: string;
  engine_version: string;
  result_sha256: string;
  processing_ms?: number | null;
  fair_form2_generated?: boolean;
  processed_at: string;
  confirmations: Confirmation[];
  duplicate?: boolean;
}
export interface DocSummary {
  id: string; original_filename: string; ingest_channel: string; industry_sector: Industry; heat_number: string;
  mill_name?: string | null; validation_status: Status; spec_code?: string | null; alloy?: string | null;
  spec_revision?: string | null; processed_at: string; counts: Counts; fair_form2_generated?: boolean;
}
export interface Plan {
  code: "starter" | "professional"; name: string; price_usd_cents: number; included_certs: number;
  overage_usd_cents: number; max_users: number; features: Record<string, boolean>;
}
export type NotifyKey = "deviation" | "review" | "email_ingest" | "usage" | "weekly_digest" | "billing";
export interface Me {
  user_id: string | null; email: string | null; kind: string; staff?: boolean;
  organization: null | {
    id: string; name: string; role: string; plan: string | null; subscription_status: string;
    features: Record<string, boolean>; default_industry: Industry; low_confidence_threshold: number;
    current_period_end: string | null; inbound_email: string | null; retention_days?: number | null;
    notify_prefs?: Record<NotifyKey, boolean>; notify_emails?: string[]; melt_countries?: string[];
    usage: { period: string; used: number; included: number; overage: number; overage_usd_cents: number };
  };
}
export interface FreeCheckResult {
  status: Status;
  chemistry: Counts & { elements: { element: string; label: string; result: Result }[] };
  spec_label: string | null; spec_status: string | null; heat_detected: boolean; processing_ms: number;
  stored: boolean; upgrade: string; demo?: boolean;
}

// Inteligencia de calidad (GET /v1/insights): conteos de resultados ya decididos por el motor.
export interface Insights {
  months: number;
  totals: { total: number; passed: number; flagged: number; review: number; heats: number; mills: number; deviation_rate: number | null; review_rate: number | null };
  monthly: { period: string; total: number; passed: number; flagged: number; review: number }[];
  mills: { mill: string; certs: number; flagged: number; review: number; deviation_rate: number | null; last_seen: string | null }[];
  specs: { spec: string; certs: number; flagged: number; deviation_rate: number | null }[];
  properties: { property: string; category: string; deviations: number; reviews: number }[];
  countries: { country: string; certs: number }[];
  note: string;
}
// Operación interna (solo staff de Arzen).
export interface OpsCheck { id: string; level: "ok" | "warn" | "fail"; detail: string }
export interface OpsHealth { status: "ok" | "warn" | "fail"; checked_at: string; fail: number; warn: number; checks: OpsCheck[] }
export interface OpsMetrics {
  generated_at: string; environment: string;
  accounts: { total: number; paying: number; past_due: number; canceled: number; new_7d: number; new_30d: number; paying_idle_14d: number };
  revenue: { mrr_usd: number; arr_usd: number; by_plan: { code: string; orgs: number; mrr_usd: number }[]; overage_this_period_usd: number; overage_certs: number; stripe_mode: string };
  certificates: { total: number; last_24h: number; last_7d: number; last_30d: number; p50_ms_30d: number | null; p95_ms_30d: number | null;
    by_status_30d: Record<string, number>; by_channel_30d: Record<string, number>; review_rate_30d: number | null; deviation_rate_30d: number | null };
  free_check: { last_24h: number; last_7d: number; last_30d: number; rejected_30d: number; global_daily_limit: number };
  funnel_30d: { free_checks: number; accounts_created: number; accounts_with_first_cert: number; accounts_paying: number };
  billing_sync: { unreported: number };
  notifications_7d: Record<string, number>;
  leads: { by_status: Record<string, number>; new_7d: number; waiting_over_2d: number; avg_score: number | null };
  prospects: { total: number; do_not_contact: number; restricted_source: number; strong_fit: number; possible_fit: number; weak_fit: number; by_status: Record<string, number> };
  catalog: { specs: number; verified: number };
}
export interface OpsAccount {
  id: string; name: string; plan_code: string | null; subscription_status: string; default_industry: string; created_at: string;
  owner_email?: string | null; members: number; certs_total: number; last_cert_at: string | null; used_this_period: number; included: number; overage_usd: number;
}
export interface Lead {
  id: string; email: string; name?: string | null; company?: string | null; role?: string | null; country?: string | null;
  mtrs_per_month?: number | null; specs?: string | null; message?: string | null; topic: string; status: string;
  score: number | null; score_reasons: { points: number; reason: string }[]; notes?: string | null; created_at: string;
}
export interface Prospect {
  id: string; company_name: string; country: string; region?: string | null; city?: string | null; website?: string | null;
  contact_email?: string | null; contact_phone?: string | null; segment: string; industries: string[]; certifications: string[];
  capabilities: string[]; materials: string[]; source: string; source_risk?: string | null; icp_score: number;
  icp_reasons: { points: number; reason: string }[]; status: string; do_not_contact: boolean; notes?: string | null;
}
