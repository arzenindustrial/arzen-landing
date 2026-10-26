"use client";
import { useEffect, useState } from "react";
import { useMe } from "@/components/app-shell";
import { PLANS } from "@/components/pricing-cards";
import { client } from "@/lib/client";
import { isoDate } from "@/lib/format";

export default function Settings() {
  const { me, reload } = useMe();
  const org = me!.organization!;
  const admin = ["owner", "admin"].includes(org.role);
  const [msg, setMsg] = useState<string | null>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [mills, setMills] = useState<any[]>([]);
  const [mill, setMill] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [retention, setRetention] = useState<number>(org.retention_days ?? 0);
  const [withFiles, setWithFiles] = useState(false);
  const [threshold, setThreshold] = useState(org.low_confidence_threshold);
  const run = async (fn: () => Promise<unknown>) => { setMsg(null); try { await fn(); } catch (e: any) { setMsg(e.message); } };

  useEffect(() => {
    if (admin) client.keys().then(setKeys).catch(() => {});
    client.mills().then(setMills).catch(() => {});
    client.members().then(setMembers).catch(() => {});
    if (admin) client.invitations().then(setInvites).catch(() => {});
  }, [admin]);
  const maxUsers = org.plan === "professional" ? 5 : org.plan === "starter" ? 2 : 1;

  const active = ["active", "trialing"].includes(org.subscription_status);
  const section = "rounded-md border border-line bg-surface p-5";
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-[26px] font-semibold">Settings</h1>
      {msg && <p role="alert" className="rounded border-l-4 border-blue bg-infobg px-4 py-2.5 text-[14px]">{msg}</p>}

      <section id="billing" className={section} aria-labelledby="h-billing">
        <h2 id="h-billing" className="text-[17px] font-semibold">Plan and billing</h2>
        <p className="mt-1 text-[14px] text-muted">
          {org.plan ? `${org.plan[0].toUpperCase()}${org.plan.slice(1)} · ${org.subscription_status}` : "No plan yet"}
          {org.current_period_end ? ` · renews ${isoDate(org.current_period_end)}` : ""}
          {` · ${org.usage.used} MTRs this month`}
        </p>
        {admin && (
          <div className="mt-4 flex flex-wrap gap-2">
            {active ? (
              <button onClick={() => run(async () => { window.location.href = (await client.portal()).url; })} className="rounded border border-fg px-4 py-2 font-medium">Manage billing</button>
            ) : PLANS.map((p) => (
              <button key={p.code} onClick={() => run(async () => { window.location.href = (await client.checkout(p.code)).url; })}
                className={`rounded px-4 py-2 font-medium ${p.featured ? "bg-blue text-white" : "border border-fg"}`}>Start {p.name} · ${p.price}/mo</button>
            ))}
          </div>
        )}
      </section>

      <section className={section} aria-labelledby="h-team">
        <h2 id="h-team" className="text-[17px] font-semibold">Team</h2>
        <ul className="mt-2 divide-y divide-line text-[14px]">
          {members.map((m) => (
            <li key={m.user_id} className="flex items-center justify-between gap-3 py-2">
              <span>{m.email}</span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-muted">{m.role}</span>
                {admin && m.role !== "owner" && m.user_id !== me?.user_id && (
                  <button onClick={() => run(async () => { await client.removeMember(m.user_id); setMembers(await client.members()); })}
                    className="text-[13px] text-muted underline">Remove</button>
                )}
              </span>
            </li>
          ))}
          {invites.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 py-2 text-muted">
              <span>{i.email} <span className="font-mono text-[12px]">· invited</span></span>
              <button onClick={() => run(async () => { await client.revokeInvitation(i.id); setInvites(await client.invitations()); })}
                className="text-[13px] underline">Cancel</button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12.5px] text-muted">{members.length + invites.length} of {maxUsers} seat{maxUsers === 1 ? "" : "s"} used, counting pending invitations.</p>
        {admin && (
          <form onSubmit={(e) => { e.preventDefault(); run(async () => {
              const r = await client.invite(inviteEmail, inviteRole);
              setInviteEmail(""); setInvites(await client.invitations());
              setMsg(r.delivery === "sent" ? "Invitation sent by email." : r.delivery === "existing_user"
                ? "They already have an Arzen account: the invitation appears when they sign in."
                : `Invitation created. Ask them to sign up at ${r.signup_url} with this email; it appears when they sign in.`);
            }); }} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@yourshop.com"
              aria-label="Email to invite" className="flex-1 rounded border border-line bg-surface px-3 py-1.5" />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} aria-label="Role" className="rounded border border-line bg-surface px-2 py-1.5">
              <option value="member">Member</option><option value="admin">Admin</option>
            </select>
            <button className="rounded border border-fg px-3 py-1.5 text-[14px]">Invite</button>
          </form>
        )}
      </section>

      <section className={section} aria-labelledby="h-retention">
        <h2 id="h-retention" className="text-[17px] font-semibold">Record retention</h2>
        <p className="mt-1 text-[14px] text-muted">How long Arzen keeps uploaded certificates and their results. When a record expires, the file and the result are deleted; the audit trail keeps its fingerprint (SHA-256) and the outcome. Check your customers' record-retention clauses before shortening this.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select value={retention} onChange={(e) => setRetention(+e.target.value)} disabled={!admin} aria-label="Retention period"
            className="rounded border border-line bg-surface px-3 py-1.5">
            <option value={0}>Keep indefinitely</option>
            <option value={365}>1 year</option>
            <option value={1095}>3 years</option>
            <option value={2555}>7 years</option>
            <option value={3650}>10 years</option>
          </select>
          {admin && <button onClick={() => run(async () => { await client.patchOrg({ retention_days: retention }); await reload(); setMsg("Retention saved."); })}
            className="rounded border border-fg px-3 py-1.5 text-[14px]">Save</button>}
        </div>
      </section>

      {admin && (
        <section className={section} aria-labelledby="h-export">
          <h2 id="h-export" className="text-[17px] font-semibold">Export your data</h2>
          <p className="mt-1 text-[14px] text-muted">A ZIP with a CSV of every certificate, the full result of each one (JSON) and your audit trail. The export itself is logged.</p>
          <label className="mt-3 flex items-center gap-2 text-[14px]">
            <input type="checkbox" checked={withFiles} onChange={(e) => setWithFiles(e.target.checked)} /> Include the original files
          </label>
          <button onClick={() => run(() => client.exportOrg(withFiles))} className="mt-3 rounded border border-fg px-3 py-1.5 text-[14px]">Download export</button>
        </section>
      )}

      <section className={section} aria-labelledby="h-review">
        <h2 id="h-review" className="text-[17px] font-semibold">Reading confidence</h2>
        <p className="mt-1 text-[14px] text-muted">Values read with lower confidence than this are marked REVIEW and need a person to confirm them.</p>
        <div className="mt-3 flex items-center gap-3">
          <input type="range" min={0.8} max={0.99} step={0.01} value={threshold} onChange={(e) => setThreshold(+e.target.value)} disabled={!admin} aria-label="Confidence threshold" />
          <span className="num">{threshold.toFixed(2)}</span>
          {admin && <button onClick={() => run(async () => { await client.patchOrg({ low_confidence_threshold: threshold }); await reload(); setMsg("Saved."); })} className="rounded border border-fg px-3 py-1.5 text-[14px]">Save</button>}
        </div>
      </section>

      <section className={section} aria-labelledby="h-mills">
        <h2 id="h-mills" className="text-[17px] font-semibold">Approved mills</h2>
        <p className="mt-1 text-[14px] text-muted">When this list has entries, certificates from other mills are marked REVIEW.</p>
        <ul className="mt-2 space-y-1 text-[14px]">
          {mills.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded border border-line px-3 py-1.5">{m.name}
              {admin && <button onClick={() => run(async () => { await client.deleteMill(m.id); setMills(await client.mills()); })} className="text-[13px] text-muted underline">Remove</button>}
            </li>
          ))}
          {!mills.length && <li className="text-muted">No list configured. Mill names are recorded, not checked.</li>}
        </ul>
        {admin && (
          <form onSubmit={(e) => { e.preventDefault(); run(async () => { await client.addMill(mill, []); setMill(""); setMills(await client.mills()); }); }} className="mt-3 flex gap-2">
            <input value={mill} onChange={(e) => setMill(e.target.value)} placeholder="Mill name" className="flex-1 rounded border border-line bg-surface px-3 py-1.5" aria-label="Mill name" />
            <button className="rounded border border-fg px-3 py-1.5 text-[14px]">Add</button>
          </form>
        )}
      </section>

      {org.inbound_email && (
        <section className={section} aria-labelledby="h-email">
          <h2 id="h-email" className="text-[17px] font-semibold">Email-in</h2>
          <p className="mt-1 text-[14px] text-muted">Forward or CC mill certificates to this address. PDF and image attachments are processed and appear in Certificates.</p>
          <p className="num mt-2 break-all rounded bg-surface2 px-3 py-2 text-[13.5px]">{org.inbound_email}</p>
        </section>
      )}

      {admin && (
        <section className={section} aria-labelledby="h-keys">
          <h2 id="h-keys" className="text-[17px] font-semibold">API keys</h2>
          <p className="mt-1 text-[14px] text-muted">Send certificates from your ERP or scripts: <span className="num">POST /v1/certificates</span> with header <span className="num">X-Api-Key</span>.</p>
          {newKey && <p className="num mt-3 break-all rounded border-l-4 border-pass bg-passbg px-3 py-2 text-[13px]">{newKey}<span className="mt-1 block font-sans text-[12.5px]">Copy this key now. It won't be shown again.</span></p>}
          <ul className="mt-3 space-y-1 text-[13.5px]">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-line px-3 py-1.5">
                <span><span className="num">{k.prefix}…</span> · {k.name}</span>
                <span className="text-muted">{k.revoked_at ? "revoked" : k.last_used_at ? `last used ${isoDate(k.last_used_at)}` : "never used"}
                  {!k.revoked_at && <button onClick={() => run(async () => { await client.revokeKey(k.id); setKeys(await client.keys()); })} className="ml-3 underline">Revoke</button>}
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={(e) => { e.preventDefault(); run(async () => { const k = await client.newKey(keyName); setNewKey(k.key); setKeyName(""); setKeys(await client.keys()); }); }} className="mt-3 flex gap-2">
            <input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="Key name, e.g. ERP" required className="flex-1 rounded border border-line bg-surface px-3 py-1.5" aria-label="Key name" />
            <button className="rounded border border-fg px-3 py-1.5 text-[14px]">Create key</button>
          </form>
        </section>
      )}
    </div>
  );
}
