"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { isDemo } from "@/lib/demo";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const next = `/app${mode === "signup" ? `/onboarding${plan ? `?plan=${plan}` : ""}` : ""}`;

  if (!supabaseConfigured()) {
    return (
      <div className="w-full max-w-md rounded-lg border border-s300 bg-white p-6">
        <h1 className="font-display text-[26px] font-bold">{mode === "login" ? "Sign in" : "Create your account"}</h1>
        <p className="mt-3 text-[15px] text-alloy">Sign-in isn't connected on this site yet.</p>
        <p className="mt-2 text-[15px] text-alloy">Accounts are opening in stages. Request early access and we&apos;ll write back with next steps.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-block rounded bg-blue px-4 py-2.5 font-medium text-white">Request early access</Link>
          {isDemo() && <Link href="/app" className="inline-block rounded border border-ink px-4 py-2.5 font-medium">Open the demo dashboard</Link>}
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const sb = supabase();
    const { data, error } = mode === "login"
      ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${next}` } });
    setBusy(false);
    if (error) return setMsg({ kind: "error", text: error.message });
    if (mode === "signup" && !data.session) return setMsg({ kind: "info", text: "Check your inbox to confirm your email, then sign in." });
    router.push(next);
  }

  async function magic() {
    if (!email) return setMsg({ kind: "error", text: "Enter your work email first." });
    setBusy(true);
    const { error } = await supabase().auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/app` } });
    setBusy(false);
    setMsg(error ? { kind: "error", text: error.message } : { kind: "info", text: "We sent you a sign-in link." });
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-s300 bg-white p-6" noValidate>
      <h1 className="font-display text-[26px] font-bold">{mode === "login" ? "Sign in" : "Create your account"}</h1>
      {mode === "signup" && <p className="mt-2 text-[14.5px] text-alloy">You'll choose a plan and pay by card next. No call needed.</p>}
      <label className="mt-5 block text-[14.5px] font-medium" htmlFor="email">Work email</label>
      <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded border border-s300 px-3 py-2" />
      <label className="mt-4 block text-[14.5px] font-medium" htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={10} required
        value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded border border-s300 px-3 py-2" />
      {mode === "signup" && <p className="mt-1 text-[12.5px] text-alloy">At least 10 characters.</p>}
      {msg && (
        <p role={msg.kind === "error" ? "alert" : "status"}
          className={`mt-4 rounded border-l-4 px-3 py-2 text-[14px] ${msg.kind === "error" ? "border-dev bg-devbg text-dev" : "border-blue bg-infobg"}`}>{msg.text}</p>
      )}
      <button type="submit" disabled={busy} className="mt-5 w-full rounded bg-blue px-4 py-2.5 font-medium text-white disabled:opacity-60">
        {busy ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      {mode === "login" && (
        <button type="button" onClick={magic} disabled={busy} className="mt-2 w-full rounded border border-ink px-4 py-2.5 font-medium">Email me a sign-in link</button>
      )}
      <p className="mt-5 text-[14px] text-alloy">
        {mode === "login" ? <>New to Arzen? <Link href="/signup" className="font-medium text-ink underline">Create an account</Link></>
          : <>Already have an account? <Link href="/login" className="font-medium text-ink underline">Sign in</Link></>}
      </p>
    </form>
  );
}
