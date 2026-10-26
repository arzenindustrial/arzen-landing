"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useMe } from "@/components/app-shell";
import { client } from "@/lib/client";
import { INDUSTRY_LABEL } from "@/lib/format";

function Onboarding() {
  const { me, reload } = useMe();
  const router = useRouter();
  const plan = useSearchParams().get("plan");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("aerospace");
  const [err, setErr] = useState<string | null>(null);
  const [invites, setInvites] = useState<{ id: string; organization_name: string; role: string }[]>([]);
  useEffect(() => { client.myInvitations().then(setInvites).catch(() => {}); }, []);
  if (me?.organization) {
    return <p>You're set up. <a href="/app" className="underline">Go to the dashboard</a>.</p>;
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await client.createOrg(name, industry);
      await reload();
      if (plan === "starter" || plan === "professional") {
        const { url } = await client.checkout(plan);
        window.location.href = url;
        return;
      }
      router.push("/app/settings#billing");
    } catch (x: any) { setErr(x.message); }
  }
  async function join(id: string) {
    setErr(null);
    try { await client.acceptInvitation(id); await reload(); router.push("/app"); } catch (x: any) { setErr(x.message); }
  }
  return (
    <div className="max-w-md space-y-8">
    {invites.length > 0 && (
      <section className="rounded-md border border-line bg-surface p-5">
        <h2 className="text-[18px] font-semibold">You've been invited</h2>
        <ul className="mt-3 space-y-2">
          {invites.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3">
              <span>{i.organization_name} <span className="font-mono text-[12px] text-muted">· {i.role}</span></span>
              <button onClick={() => join(i.id)} className="rounded bg-blue px-3 py-1.5 font-medium text-white">Join</button>
            </li>
          ))}
        </ul>
      </section>
    )}
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-[26px] font-semibold">{invites.length ? "Or set up your own shop" : "Set up your shop"}</h1>
      <label className="block text-[14.5px] font-medium">Company name
        <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded border border-line bg-surface px-3 py-2" />
      </label>
      <label className="block text-[14.5px] font-medium">Main industry
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1.5 w-full rounded border border-line bg-surface px-3 py-2">
          {Object.entries(INDUSTRY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="mt-1 block text-[12.5px] font-normal text-muted">Sets the default specification catalog. You can check any industry's certificates.</span>
      </label>
      {err && <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-3 py-2 text-[14px] text-dev">{err}</p>}
      <button className="rounded bg-blue px-4 py-2.5 font-medium text-white">{plan ? "Continue to payment" : "Continue"}</button>
    </form>
    </div>
  );
}

export default function Page() {
  return <Suspense><Onboarding /></Suspense>;
}
