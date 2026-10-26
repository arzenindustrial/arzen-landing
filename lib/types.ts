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
export interface Me {
  user_id: string | null; email: string | null; kind: string;
  organization: null | {
    id: string; name: string; role: string; plan: string | null; subscription_status: string;
    features: Record<string, boolean>; default_industry: Industry; low_confidence_threshold: number;
    current_period_end: string | null; inbound_email: string | null; retention_days?: number | null;
    usage: { period: string; used: number; included: number; overage: number; overage_usd_cents: number };
  };
}
export interface FreeCheckResult {
  status: Status;
  chemistry: Counts & { elements: { element: string; label: string; result: Result }[] };
  spec_label: string | null; spec_status: string | null; heat_detected: boolean; processing_ms: number;
  stored: boolean; upgrade: string; demo?: boolean;
}
