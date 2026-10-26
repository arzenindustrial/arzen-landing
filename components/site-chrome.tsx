import Link from "next/link";
import { Logo } from "./brand";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/industries/aerospace", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-s100 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Arzen home"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-[14.5px] md:flex">
          {NAV.map((n) => <Link key={n.href} href={n.href} className="text-ink hover:text-blue">{n.label}</Link>)}
          <Link href="/login" className="text-ink hover:text-blue">Sign in</Link>
          <Link href="/check" className="rounded bg-blue px-3.5 py-2 font-medium text-white hover:bg-[#1c43bb]">Check an MTR free</Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded border border-ink px-3 py-1.5 text-[14px] font-medium">Menu</summary>
          <nav aria-label="Main" className="absolute right-0 mt-2 flex w-56 flex-col rounded-md border border-s100 bg-white p-2 shadow-sm">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="rounded px-3 py-2 hover:bg-paper">{n.label}</Link>)}
            <Link href="/login" className="rounded px-3 py-2 hover:bg-paper">Sign in</Link>
            <Link href="/check" className="mt-1 rounded bg-blue px-3 py-2 text-center font-medium text-white">Check an MTR free</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-s300">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo reversed descriptor />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed">Verified before it ships.</p>
        </div>
        <FooterCol title="Product" links={[["/#how-it-works", "How it works"], ["/check", "Free MTR check"], ["/sample-report", "Sample report"], ["/pricing", "Pricing"]]} />
        <FooterCol title="Industries" links={[["/industries/aerospace", "Aerospace & Defense"], ["/industries/medical", "Medical Devices"], ["/industries/oil-gas", "Oil, Gas & Energy"], ["/industries/automotive", "Automotive & EV"]]} />
        <FooterCol title="Company" links={[["/trust", "Trust center"], ["/limits", "What Arzen does not do"], ["/login", "Sign in"]]} />
      </div>
      <div className="border-t border-white/10">
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
