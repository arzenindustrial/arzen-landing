"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMe } from "@/components/app-shell";
import { EvidenceViewer, type Highlight } from "@/components/evidence-viewer";
import { ResultsTable } from "@/components/results-table";
import { CountsLine, StatusBadge } from "@/components/status";
import { api, API_URL } from "@/lib/api";
import { client } from "@/lib/client";
import { INDUSTRY_LABEL, isoDateTime, shortHash } from "@/lib/format";
import type { CertDocument, Check, Spec } from "@/lib/types";

function fieldPath(c: Check, doc: CertDocument): string | null {
  if (c.category === "chemistry") return `chemistry.${c.property}`;
  if (c.category === "mechanical") return `mechanics.${c.property}`;
  if (c.category === "hardness") return "hardness.0";
  if (c.property === "extraction") {
    const i = (doc.extracted_data.warnings || []).indexOf(c.reason);
    return i >= 0 ? `warning.${i}` : null;
  }
  if (["heat_number", "mill_name"].includes(c.property)) return c.property;
  return null;
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const { me } = useMe();
  const router = useRouter();
  const [doc, setDoc] = useState<CertDocument | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Check | null>(null);
  const [audit, setAudit] = useState<any[]>([]);
  const [specs, setSpecs] = useState<Spec[] | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceKind, setSourceKind] = useState<"pdf" | "image">("pdf");
  const [selected, setSelected] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const features = me?.organization?.features || {};

  const load = useCallback(async () => {
    try {
      const d = await client.certificate(params.id);
      setDoc(d);
      client.audit(params.id).then(setAudit).catch(() => {});
    } catch (e: any) { setErr(e.message); }
  }, [params.id]);
  useEffect(() => { load(); }, [load]);

  // Evidencia al lado: el original junto a la tabla (brand book §14).
  useEffect(() => {
    let url: string | null = null;
    if (!doc) return;
    if (client.demo()) { setSourceUrl(`/samples/${doc.id}.pdf`); setSourceKind("pdf"); return; }
    if (!API_URL) return;
    api<Blob>(`/v1/certificates/${doc.id}/source`).then((b) => {
      const blob = b as Blob;
      setSourceKind(blob.type.startsWith("image/") ? "image" : "pdf");
      url = URL.createObjectURL(blob);
      setSourceUrl(url);
    }).catch(() => {});
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [doc?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (err) return <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-4 py-3 text-dev">{err}</p>;
  if (!doc) return <p className="text-muted">Loading…</p>;
  const v = doc.validation;
  const ex = doc.extracted_data;
  const alloy = ex.alloy?.value || doc.spec?.alloy_designation || "Material";

  async function exportPdf(kind: "summary" | "form2" | "ppap", part: Record<string, string> = {}) {
    setNotice(null);
    try { await client.report(doc!.id, kind, doc!.heat_number, part); load(); } catch (e: any) { setNotice(e.message); }
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted"><Link href="/app/certificates" className="underline underline-offset-2">Certificates</Link> / <span className="num">{doc.heat_number}</span></nav>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold">{alloy} · Heat <span className="num">{doc.heat_number}</span></h1>
          <p className="num mt-1 text-[13px] text-muted">
            {v.spec_label || "Specification not matched"} · {doc.industry_sector ? INDUSTRY_LABEL[doc.industry_sector] : ""} · {doc.original_filename}
          </p>
        </div>
        <StatusBadge status={doc.validation_status} />
      </header>

      <CountsLine counts={v.counts} size="lg" />

      {v.spec_status === "draft_unverified" && (
        <p className="rounded border-l-4 border-warn bg-warnbg px-4 py-2.5 text-[14px] text-warn">
          The limits for this specification are a draft and have not been verified against the licensed standard. This certificate cannot read “within limits” until they are, or until you choose a verified specification of your own.
        </p>
      )}
      {v.discrepancies.length > 0 && (
        <div className="rounded-md border-l-4 border-dev bg-devbg px-4 py-3 text-[15px] text-dev">
          {v.discrepancies.map((x) => <p key={x}>▲ {x}</p>)}
        </div>
      )}
      {!doc.spec && <SpecPicker doc={doc} specs={specs} setSpecs={setSpecs} onChosen={setDoc} setNotice={setNotice} />}
      {notice && <p role="status" className="rounded border-l-4 border-blue bg-infobg px-4 py-2.5 text-[14px]">{notice}</p>}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section aria-labelledby="results">
          <h2 id="results" className="sr-only">Results</h2>
          <ResultsTable checks={v.checks} onConfirm={(c) => (fieldPath(c, doc) ? setConfirming(c) : null)} selected={selected}
            onSelectSource={(c, i) => { setSelected(i); setHighlight({ page: c.source?.page, bbox: c.source?.bbox, label: c.label }); }} />
          {v.notes.length > 0 && (
            <div className="mt-5">
              <h3 className="text-[15px] font-semibold">What was not checked</h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[14px] text-muted">{v.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          )}
        </section>
        <aside aria-labelledby="evidence" className="space-y-4">
          <h2 id="evidence" className="text-[15px] font-semibold">Source document</h2>
          {sourceUrl ? (
            <>
              <p className="text-[13px] text-muted">Select a page reference in the results to box that value on the original.</p>
              <EvidenceViewer url={sourceUrl} kind={sourceKind} highlight={highlight} />
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-[13.5px] underline underline-offset-2">Open the original in a new tab</a>
            </>
          ) : <p className="rounded-md border border-line bg-surface p-6 text-muted">The original file isn't available here.</p>}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-md border border-line bg-surface p-4 text-[13px]">
            <dt className="text-muted">Source SHA-256</dt><dd className="num break-all">{doc.file_sha256}</dd>
            <dt className="text-muted">Mill</dt><dd>{ex.mill_name?.value || "—"}</dd>
            <dt className="text-muted">Country of melt</dt><dd>{ex.country_of_melt?.value || "—"} <span className="text-muted">(as read)</span></dd>
            <dt className="text-muted">Reading</dt><dd className="num">{doc.ocr_engine} → {doc.normalizer}</dd>
            <dt className="text-muted">Engine</dt><dd className="num">{doc.engine_version} · {shortHash(doc.result_sha256)}</dd>
            <dt className="text-muted">Processed</dt><dd className="num">{isoDateTime(doc.processed_at)}</dd>
          </dl>
        </aside>
      </div>

      <section aria-labelledby="export" className="rounded-md border border-line bg-surface p-5">
        <h2 id="export" className="text-[17px] font-semibold">Export</h2>
        <p className="mt-1 text-[14px] text-muted">Each PDF carries the source file's SHA-256 and is logged in the audit trail.</p>
        <ExportPanel features={features} onExport={exportPdf} />
        <SharePanel docId={doc.id} admin={["owner", "admin"].includes(me?.organization?.role || "")} setNotice={setNotice} />
      </section>

      {["owner", "admin"].includes(me?.organization?.role || "") && (
        <section aria-labelledby="danger" className="rounded-md border border-line bg-surface p-5">
          <h2 id="danger" className="text-[15px] font-semibold">Delete this certificate</h2>
          <p className="mt-1 text-[13.5px] text-muted">Removes the original file and its result. The audit trail keeps the file's fingerprint and the outcome. Usage already counted this month is not refunded.</p>
          <button onClick={async () => {
              if (!window.confirm(`Delete heat ${doc.heat_number}? This can't be undone.`)) return;
              try { await client.deleteCertificate(doc.id); router.push("/app/certificates"); } catch (e: any) { setNotice(e.message); }
            }} className="mt-3 rounded border border-dev px-3 py-1.5 text-[14px] text-dev">Delete certificate</button>
        </section>
      )}

      <section aria-labelledby="trail">
        <h2 id="trail" className="text-[17px] font-semibold">Audit trail</h2>
        <ol className="mt-3 space-y-2 text-[13.5px]">
          {audit.map((a) => (
            <li key={a.id} className="flex flex-wrap gap-x-4 gap-y-0.5 rounded border border-line bg-surface px-3 py-2">
              <span className="num text-muted">{new Date(a.unix_ts * 1000).toISOString().replace("T", " ").slice(0, 19)} UTC</span>
              <span className="font-medium">{a.action}</span>
              <span className="text-muted">{a.actor}</span>
              <span className="num text-muted">#{String(a.entry_hash).slice(0, 12)}</span>
            </li>
          ))}
        </ol>
        {doc.confirmations.length > 0 && (
          <div className="mt-4">
            <h3 className="text-[15px] font-semibold">Confirmed by a person</h3>
            <ul className="mt-1.5 space-y-1 text-[13.5px]">
              {doc.confirmations.map((c, i) => (
                <li key={i} className="num">{c.field_path}: “{c.original_value ?? "—"}” → “{c.confirmed_value}” · {c.confirmed_by_email || "user"} · {isoDateTime(c.confirmed_at)}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {confirming && (
        <ConfirmDialog check={confirming} path={fieldPath(confirming, doc)!} onClose={() => setConfirming(null)}
          onDone={(d) => { setDoc(d); setConfirming(null); client.audit(d.id).then(setAudit); }} docId={doc.id} />
      )}
    </div>
  );
}

function ExportPanel({ features, onExport }: { features: Record<string, boolean>; onExport: (k: "summary" | "form2" | "ppap", p?: Record<string, string>) => void }) {
  const [part, setPart] = useState({ part_number: "", part_name: "", serial_number: "", fai_report_number: "", prepared_by: "" });
  return (
    <div className="mt-4 space-y-4">
      <button onClick={() => onExport("summary")} className="rounded bg-blue px-4 py-2.5 font-medium text-white">Download MTR audit summary</button>
      <fieldset className="rounded border border-line p-4">
        <legend className="px-1 text-[14px] font-semibold">FAIR and PPAP {features.fair_form2 ? "" : "· Professional plan"}</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {([["part_number", "Part number"], ["part_name", "Part name"], ["serial_number", "Serial number"], ["fai_report_number", "FAI report number"], ["prepared_by", "Prepared by"]] as const).map(([k, l]) => (
            <label key={k} className="text-[13px]">{l}
              <input value={part[k]} onChange={(e) => setPart({ ...part, [k]: e.target.value })} disabled={!features.fair_form2}
                className="mt-1 w-full rounded border border-line bg-surface px-2 py-1.5 disabled:opacity-50" />
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => onExport("form2", part)} disabled={!features.fair_form2} className="rounded border border-fg px-4 py-2 font-medium disabled:opacity-40">Export AS9102 Form 2</button>
          <button onClick={() => onExport("ppap", part)} disabled={!features.ppap} className="rounded border border-fg px-4 py-2 font-medium disabled:opacity-40">Export PPAP material results</button>
        </div>
        <p className="mt-2 text-[12.5px] text-muted">Field 9 (customer approval verification) is left blank for your quality team. Check field names against the current AS9102 edition before sending.</p>
      </fieldset>
    </div>
  );
}

function SharePanel({ docId, admin, setNotice }: { docId: string; admin: boolean; setNotice: (s: string) => void }) {
  const [url, setUrl] = useState<string | null>(null);
  if (!admin) return null;
  async function toggle(enabled: boolean) {
    try { setUrl((await client.share(docId, enabled)).share_url); } catch (e: any) { setNotice(e.message); }
  }
  return (
    <div className="mt-4 rounded border border-line p-4">
      <h3 className="text-[14px] font-semibold">Public read-only link</h3>
      <p className="mt-1 text-[13px] text-muted">Off by default. When on, anyone with the link sees the results summary and the source fingerprint (not the original file), and exported PDFs carry the link. Turning it off breaks the link.</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {url ? (
          <>
            <a href={url} target="_blank" rel="noopener noreferrer" className="num break-all text-[13px] text-blue underline">{url}</a>
            <button onClick={() => toggle(false)} className="rounded border border-fg px-3 py-1 text-[13px]">Turn off</button>
          </>
        ) : <button onClick={() => toggle(true)} className="rounded border border-fg px-3 py-1 text-[13px]">Create link</button>}
      </div>
    </div>
  );
}

function SpecPicker({ doc, specs, setSpecs, onChosen, setNotice }: {
  doc: CertDocument; specs: Spec[] | null; setSpecs: (s: Spec[]) => void; onChosen: (d: CertDocument) => void; setNotice: (s: string) => void;
}) {
  const [choice, setChoice] = useState("");
  useEffect(() => { if (!specs) client.specs(doc.industry_sector).then(setSpecs).catch(() => setSpecs([])); }, [doc.industry_sector, specs, setSpecs]);
  const options = (doc.spec_candidates && doc.spec_candidates.length ? doc.spec_candidates : specs) || [];
  async function apply() {
    try { onChosen(await client.chooseSpec(doc.id, choice)); } catch (e: any) { setNotice(e.message); }
  }
  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <p className="font-medium">Pick the governing specification</p>
      <p className="text-[14px] text-muted">{doc.spec_candidates?.length ? "More than one entry matches this MTR." : "We don't have limits for this specification yet. You can still pick one, or add your own under Specifications."}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <select value={choice} onChange={(e) => setChoice(e.target.value)} className="rounded border border-line bg-surface px-3 py-2 sm:w-96" aria-label="Specification">
          <option value="">Choose…</option>
          {options.map((s) => <option key={s.id ?? s.spec_code + s.alloy_designation} value={s.id ?? ""}>{s.spec_code} · {s.alloy_designation} · {s.product_form}</option>)}
        </select>
        <button onClick={apply} disabled={!choice} className="rounded bg-blue px-4 py-2 font-medium text-white disabled:opacity-50">Re-check</button>
      </div>
    </div>
  );
}

function ConfirmDialog({ check, path, docId, onClose, onDone }: { check: Check; path: string; docId: string; onClose: () => void; onDone: (d: CertDocument) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState(check.measured?.replace(/[^\d.<>≤≥,-]/g, "").trim() || "");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isAck = path.startsWith("warning.");
  useEffect(() => { ref.current?.showModal(); }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try { onDone(await client.confirm(docId, path, isAck ? "acknowledged" : value)); } catch (x: any) { setErr(x.message); setBusy(false); }
  }
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="confirm-title"
      className="w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface p-0 text-fg backdrop:bg-ink/60">
      <form onSubmit={submit} className="p-6">
        <h2 id="confirm-title" className="text-[18px] font-semibold">{isAck ? "Acknowledge" : "Confirm"} · {check.label}</h2>
        <p className="mt-2 text-[14px] text-muted">{check.reason}</p>
        {check.source?.page && <p className="num mt-2 text-[13px]">Look at page {check.source.page}{check.source.row ? `, row ${check.source.row}` : ""} of the original.{check.source.snippet ? ` Line read: “${check.source.snippet}”` : ""}</p>}
        {!isAck && (
          <label className="mt-4 block text-[14px] font-medium">Value as printed on the original
            <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} required maxLength={64}
              className="num mt-1.5 w-full rounded border border-line bg-surface px-3 py-2" />
            <span className="mt-1 block text-[12.5px] font-normal text-muted">Type the number exactly as printed (for example 0.27 or &lt;0.005). Your name and the time are recorded; the original reading is kept.</span>
          </label>
        )}
        {err && <p role="alert" className="mt-3 rounded border-l-4 border-dev bg-devbg px-3 py-2 text-[14px] text-dev">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} className="rounded border border-line px-4 py-2">Cancel</button>
          <button type="submit" disabled={busy} className="rounded bg-blue px-4 py-2 font-medium text-white disabled:opacity-60">{isAck ? "Acknowledge" : "Confirm and re-check"}</button>
        </div>
      </form>
    </dialog>
  );
}
