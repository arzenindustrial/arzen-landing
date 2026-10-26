"use client";
// Acceso a datos del dashboard. En modo demo responde con resultados reales del motor sobre MTR sintéticos.
import { api, download } from "./api";
import { demoCatalog, demoDocs, demoMe, demoSummaries, isDemo } from "./demo";
import type { CertDocument, DocSummary, Me, Plan, Spec } from "./types";

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));
let demoState = demoDocs.map((d) => structuredClone(d));

export const client = {
  demo: isDemo,
  async me(): Promise<Me> {
    if (isDemo()) return demoMe;
    return api("/v1/me");
  },
  async createOrg(name: string, industry: string): Promise<{ id: string }> {
    return api("/v1/orgs", { method: "POST", body: JSON.stringify({ name, industry }) });
  },
  async certificates(q = "", status = ""): Promise<{ items: DocSummary[]; total: number }> {
    if (isDemo()) {
      await wait(120);
      const needle = q.trim().toLowerCase();
      const items = demoSummaries().filter((d) =>
        (!needle || [d.heat_number, d.mill_name, d.original_filename, d.spec_code].some((x) => (x || "").toLowerCase().includes(needle))) &&
        (!status || d.validation_status === status));
      return { items, total: items.length };
    }
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    return api(`/v1/certificates?${p}`);
  },
  async certificate(id: string): Promise<CertDocument> {
    if (isDemo()) {
      const d = demoState.find((x) => x.id === id);
      if (!d) throw new Error("Certificate not found.");
      return structuredClone(d);
    }
    return api(`/v1/certificates/${id}`);
  },
  async upload(file: File, industry?: string): Promise<CertDocument> {
    if (isDemo()) {
      await wait(900);
      throw new Error("Demo mode: uploads need the Arzen API. Open one of the sample certificates instead.");
    }
    const fd = new FormData();
    fd.append("file", file);
    if (industry) fd.append("industry", industry);
    return api("/v1/certificates", { method: "POST", body: fd });
  },
  async confirm(id: string, field_path: string, value: string): Promise<CertDocument> {
    if (isDemo()) throw new Error("Demo mode: confirmations need the Arzen API.");
    return api(`/v1/certificates/${id}/confirm`, { method: "POST", body: JSON.stringify({ field_path, value }) });
  },
  async chooseSpec(id: string, spec_id: string): Promise<CertDocument> {
    if (isDemo()) throw new Error("Demo mode: choosing a specification needs the Arzen API.");
    return api(`/v1/certificates/${id}/spec`, { method: "POST", body: JSON.stringify({ spec_id }) });
  },
  async report(id: string, kind: "summary" | "form2" | "ppap", heat: string, part: Record<string, string> = {}): Promise<void> {
    if (isDemo()) throw new Error("Demo mode: PDF export needs the Arzen API. A sample PDF is in v3/docs/samples.");
    const p = new URLSearchParams({ kind, ...Object.fromEntries(Object.entries(part).filter(([, v]) => v)) });
    return download(`/v1/certificates/${id}/report.pdf?${p}`, `arzen-${kind}-${heat}.pdf`);
  },
  async specs(industry = ""): Promise<Spec[]> {
    if (isDemo()) return demoCatalog.filter((s) => !industry || s.industry_sector === industry);
    return api(`/v1/specs${industry ? `?industry=${industry}` : ""}`);
  },
  async addSpec(body: unknown): Promise<{ id: string }> {
    if (isDemo()) throw new Error("Demo mode: adding specifications needs the Arzen API.");
    return api("/v1/specs", { method: "POST", body: JSON.stringify(body) });
  },
  async plans(): Promise<Plan[]> {
    return api("/v1/plans");
  },
  async checkout(plan: string): Promise<{ url: string }> {
    if (isDemo()) throw new Error("Demo mode: billing needs the Arzen API and Stripe.");
    return api("/v1/billing/checkout", { method: "POST", body: JSON.stringify({ plan }) });
  },
  async portal(): Promise<{ url: string }> {
    if (isDemo()) throw new Error("Demo mode: billing needs the Arzen API and Stripe.");
    return api("/v1/billing/portal", { method: "POST" });
  },
  async keys(): Promise<any[]> {
    if (isDemo()) return [{ id: "k1", name: "ERP integration", prefix: "az_3f9c2a7e1", created_at: "2026-10-20T10:00:00Z", last_used_at: "2026-10-24T15:12:09Z", revoked_at: null }];
    return api("/v1/api-keys");
  },
  async newKey(name: string): Promise<{ key: string; prefix: string }> {
    if (isDemo()) throw new Error("Demo mode: API keys need the Arzen API.");
    return api("/v1/api-keys", { method: "POST", body: JSON.stringify({ name }) });
  },
  async revokeKey(id: string): Promise<void> {
    if (isDemo()) throw new Error("Demo mode.");
    await api(`/v1/api-keys/${id}`, { method: "DELETE" });
  },
  async mills(): Promise<any[]> {
    if (isDemo()) return [];
    return api("/v1/mills");
  },
  async addMill(name: string, aliases: string[]): Promise<void> {
    if (isDemo()) throw new Error("Demo mode.");
    await api("/v1/mills", { method: "POST", body: JSON.stringify({ name, aliases }) });
  },
  async deleteMill(id: string): Promise<void> {
    if (isDemo()) throw new Error("Demo mode.");
    await api(`/v1/mills/${id}`, { method: "DELETE" });
  },
  async members(): Promise<any[]> {
    if (isDemo()) return [{ user_id: "demo", email: demoMe.email, role: "owner" }];
    return api("/v1/org/members");
  },
  async patchOrg(body: Record<string, unknown>): Promise<void> {
    if (isDemo()) throw new Error("Demo mode.");
    await api("/v1/org", { method: "PATCH", body: JSON.stringify(body) });
  },
  async invitations(): Promise<any[]> {
    if (isDemo()) return [];
    return api("/v1/invitations");
  },
  async invite(email: string, role: string): Promise<{ delivery: string; signup_url: string }> {
    if (isDemo()) throw new Error("Demo mode: invitations need the Arzen API.");
    return api("/v1/invitations", { method: "POST", body: JSON.stringify({ email, role }) });
  },
  async revokeInvitation(id: string): Promise<void> {
    if (isDemo()) throw new Error("Demo mode.");
    await api(`/v1/invitations/${id}`, { method: "DELETE" });
  },
  async myInvitations(): Promise<{ id: string; organization_name: string; role: string; expires_at: string }[]> {
    if (isDemo()) return [];
    return api("/v1/invitations/mine");
  },
  async acceptInvitation(id: string): Promise<void> {
    await api(`/v1/invitations/${id}/accept`, { method: "POST" });
  },
  async removeMember(userId: string): Promise<void> {
    if (isDemo()) throw new Error("Demo mode.");
    await api(`/v1/org/members/${userId}`, { method: "DELETE" });
  },
  async share(id: string, enabled: boolean): Promise<{ share_url: string | null }> {
    if (isDemo()) throw new Error("Demo mode: public links need the Arzen API.");
    return api(`/v1/certificates/${id}/share`, { method: "POST", body: JSON.stringify({ enabled }) });
  },
  async exportOrg(includeFiles: boolean): Promise<void> {
    if (isDemo()) throw new Error("Demo mode: export needs the Arzen API.");
    return download(`/v1/export?include_files=${includeFiles}`, `arzen-export-${new Date().toISOString().slice(0, 10)}.zip`);
  },
  async deleteCertificate(id: string): Promise<void> {
    if (isDemo()) throw new Error("Demo mode: deleting needs the Arzen API.");
    await api(`/v1/certificates/${id}`, { method: "DELETE" });
  },
  async audit(id: string): Promise<any[]> {
    if (isDemo()) {
      const d = demoState.find((x) => x.id === id);
      return d ? [{ id: 1, actor: "user:demo", action: "cert.processed", unix_ts: Math.floor(new Date(d.processed_at).getTime() / 1000),
        entry_hash: d.result_sha256, payload: { status: d.validation_status } }] : [];
    }
    return api(`/v1/certificates/${id}/audit`);
  },
};
