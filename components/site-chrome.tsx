import Link from "next/link";
import { Logo } from "./brand";
import { NavLinks } from "./nav-links";
import { NAV } from "@/lib/site";


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/[0.96] text-paper backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Arzen home" className="rounded-[3px]"><Logo reversed /></Link>
        <NavLinks />
        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[4px] border border-white/25 px-3 py-1.5 text-[14px] font-medium">
            <span aria-hidden className="flex w-4 flex-col gap-[3px]"><span className="h-[2px] bg-paper transition-transform group-open:translate-y-[5px] group-open:rotate-45" /><span className="h-[2px] bg-paper transition-opacity group-open:opacity-0" /><span className="h-[2px] bg-paper transition-transform group-open:-translate-y-[5px] group-open:-rotate-45" /></span>
            Menu
          </summary>
          <nav aria-label="Main" className="faq-body absolute right-0 mt-2 flex w-60 flex-col rounded-md border border-white/10 bg-[#16212E] p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,.8)]">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="rounded px-3 py-2.5 hover:bg-white/5">{n.label}</Link>)}
            <Link href="/login" className="rounded px-3 py-2.5 hover:bg-white/5">Sign in</Link>
            <Link href="/check" className="mt-1 rounded bg-blue px-3 py-2.5 text-center font-medium text-white">Check an MTR free</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-s300">
      <div aria-hidden className="bp-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid max-w-page gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo reversed descriptor />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed">Verified before it ships.</p>
        </div>
        <FooterCol title="Product" links={[["/#how-it-works", "How it works"], ["/check", "Free MTR check"], ["/sample-report", "Sample report"], ["/pricing", "Pricing"]]} />
        <FooterCol title="Industries" links={[["/industries/aerospace", "Aerospace & Defense"], ["/industries/medical", "Medical Devices"], ["/industries/oil-gas", "Oil, Gas & Energy"], ["/industries/automotive", "Automotive & EV"]]} />
        <FooterCol title="Company" links={[["/trust", "Trust center"], ["/limits", "What Arzen does not do"], ["/login", "Sign in"]]} />
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-5 text-[12.5px] sm:flex-row sm:justify-between sm:px-6">
          <span>Arzen is a product of Arzen Industrial Group.</span>
          <span>Specification names are trademarks of their owners. Arzen is not affiliated with any standards body.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h2 className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-s300">{title}</h2>
      <ul className="mt-3 space-y-2 text-[14px]">
        {links.map(([href, label]) => <li key={href}><Link href={href} className="text-paper/90 hover:text-white hover:underline">{label}</Link></li>)}
      </ul>
    </div>
  );
}
