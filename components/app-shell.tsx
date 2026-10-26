"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { client } from "@/lib/client";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Me } from "@/lib/types";
import { Logo } from "./brand";

const MeCtx = createContext<{ me: Me | null; reload: () => Promise<void> }>({ me: null, reload: async () => {} });
export const useMe = () => useContext(MeCtx);

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/certificates", label: "Certificates" },
  { href: "/app/specs", label: "Specifications" },
  { href: "/app/settings", label: "Settings" },
];

type Theme = "system" | "light" | "dark";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try { setTheme((localStorage.getItem("arzen-theme") as Theme) || "system"); } catch {}
  }, []);
  const cycleTheme = () => {
    const nextTheme: Theme = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(nextTheme);
    try { localStorage.setItem("arzen-theme", nextTheme); } catch {}
  };

  const reload = useCallback(async () => {
    try {
      if (!client.demo() && supabaseConfigured()) {
        const { data } = await supabase().auth.getSession();
        if (!data.session) return router.replace("/login");
      }
      const m = await client.me();
      setMe(m);
      if (!m.organization && !path.startsWith("/app/onboarding")) router.replace("/app/onboarding");
    } catch (e: any) {
      setErr(e.message);
    }
  }, [path, router]);
  useEffect(() => { reload(); }, [reload]);

  async function signOut() {
    if (supabaseConfigured()) await supabase().auth.signOut();
    router.push("/");
  }

  const org = me?.organization;
  const usage = org?.usage;
  const pct = usage && usage.included ? Math.min(100, Math.round((usage.used / usage.included) * 100)) : 0;

  return (
    <div className="app-shell min-h-screen bg-bg text-fg" data-theme={theme === "system" ? undefined : theme}>
      {client.demo() && (
        <div className="bg-blue px-4 py-1.5 text-center font-mono text-[12px] text-white">
          DEMO · SAMPLE DATA from synthetic certificates · the API and sign-in are not connected
        </div>
      )}
      <div className="mx-auto flex max-w-[1400px] flex-col md:flex-row">
        <aside className="border-b border-line bg-surface md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-4 md:block">
            <Link href="/app" aria-label="Arzen dashboard"><Logo adaptive /></Link>
            <button onClick={cycleTheme} className="rounded border border-line px-2 py-1 font-mono text-[11px] md:mt-4" aria-label={`Theme: ${theme}. Change theme`}>
              Theme: {theme}
            </button>
          </div>
          <nav aria-label="Product" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
            {NAV.map((n) => {
              const active = n.href === "/app" ? path === "/app" : path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded px-3 py-2 text-[14.5px] ${active ? "bg-surface2 font-semibold" : "text-muted hover:bg-surface2 hover:text-fg"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          {org && (
            <div className="hidden px-5 pt-8 text-[13px] md:block">
              <p className="font-semibold">{org.name}</p>
              <p className="text-muted">{org.plan ? `${org.plan[0].toUpperCase()}${org.plan.slice(1)}` : "No plan"} · {org.subscription_status}</p>
              {usage && usage.included > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between font-mono text-[11.5px] text-muted"><span>MTRs this month</span><span>{usage.used} / {usage.included}</span></div>
                  <div className="mt-1 h-1.5 rounded bg-surface2" role="progressbar" aria-valuenow={usage.used} aria-valuemin={0} aria-valuemax={usage.included} aria-label="Certificates used this month">
                    <div className="h-full rounded bg-fg" style={{ width: `${pct}%` }} />
                  </div>
                  {usage.overage > 0 && <p className="mt-1 font-mono text-[11.5px] text-warn">{usage.overage} over the included amount</p>}
                </div>
              )}
              <button onClick={signOut} className="mt-6 text-muted underline underline-offset-2 hover:text-fg">Sign out</button>
            </div>
          )}
        </aside>
        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {err ? <p role="alert" className="rounded border-l-4 border-dev bg-devbg px-4 py-3 text-dev">{err}</p> : (
            <MeCtx.Provider value={{ me, reload }}>{me ? children : <p className="text-muted">Loading…</p>}</MeCtx.Provider>
          )}
        </main>
      </div>
    </div>
  );
}
