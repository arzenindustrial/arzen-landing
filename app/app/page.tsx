"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMe } from "@/components/app-shell";
import { Dropzone } from "@/components/dropzone";
import { CertTable } from "@/components/cert-table";
import { client } from "@/lib/client";
import type { DocSummary } from "@/lib/types";

export default function Dashboard() {
  const { me, reload } = useMe();
  const router = useRouter();
  const [recent, setRecent] = useState<DocSummary[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const org = me?.organization;
  const active = org && ["active", "trialing"].includes(org.subscription_status);

  useEffect(() => { client.certificates().then((r) => setRecent(r.items.slice(0, 8))).catch(() => setRecent([])); }, []);

  async function onFiles(files: File[]) {
    setErrors([]);
    let last: string | null = null;
    for (const [i, f] of files.entries()) {
      setBusy(files.length > 1 ? `Reading ${f.name} (${i + 1} of ${files.length})…` : `Reading ${f.name}…`);
      try {
        const d = await client.upload(f);
        last = d.id;
      } catch (e: any) {
        setErrors((x) => [...x, `${f.name}: ${e.message}`]);
      }
    }
    setBusy(null);
    await reload();
    if (last && files.length === 1) router.push(`/app/certificates/${last}`);
    else client.certificates().then((r) => setRecent(r.items.slice(0, 8)));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[26px] font-semibold">Dashboard</h1>
        {org?.inbound_email && (
          <p className="text-[13px] text-muted">Forward certificates to <span className="num text-fg">{org.inbound_email}</span></p>
        )}
      </div>
      {!active && !client.demo() ? (
        <div className="rounded-lg border border-line bg-surface p-6">
          <h2 className="text-[18px] font-semibold">Choose a plan to start checking certificates</h2>
          <p className="mt-1.5 text-muted">Pay by card and start right away. The free MTR check on our site works without a plan.</p>
          <Link href="/app/settings#billing" className="mt-4 inline-block rounded bg-blue px-4 py-2.5 font-medium text-white">Choose a plan</Link>
        </div>
      ) : (
        <Dropzone onFiles={onFiles} busy={!!busy} busyText={busy || undefined} multiple />
      )}
      {errors.length > 0 && (
        <div role="alert" className="space-y-1 rounded border-l-4 border-dev bg-devbg px-4 py-3 text-[14.5px] text-dev">
          {errors.map((e) => <p key={e}>{e}</p>)}
        </div>
      )}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[17px] font-semibold">Recent certificates</h2>
          <Link href="/app/certificates" className="text-[14px] text-muted underline underline-offset-2 hover:text-fg">All certificates</Link>
        </div>
        {recent === null ? <p className="text-muted">Loading…</p> : <CertTable items={recent} />}
      </section>
    </div>
  );
}
