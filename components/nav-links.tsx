"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

/** Navegación de escritorio: la sección activa lleva la línea de lectura azul debajo. */
export function NavLinks() {
  const path = usePathname();
  const active = (href: string) => (href.startsWith("/industries") ? path.startsWith("/industries") : href !== "/#how-it-works" && path === href);
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 text-[14.5px] md:flex">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
          className="group relative rounded-[3px] px-3 py-2 text-paper/85 transition-colors hover:text-white">
          {n.label}
          <span aria-hidden className={`absolute inset-x-3 -bottom-[1px] h-[2px] origin-left bg-[var(--blue-on-ink)] transition-transform duration-300 ${active(n.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
        </Link>
      ))}
      <span aria-hidden className="mx-2 h-5 w-px bg-white/15" />
      <Link href="/login" className="rounded-[3px] px-3 py-2 text-paper/85 transition-colors hover:text-white">Sign in</Link>
      <Link href="/check" className="group ml-1 inline-flex items-center gap-1.5 rounded bg-blue px-3.5 py-2 font-medium text-white transition-colors hover:bg-[#1c43bb]">
        Check an MTR free <span aria-hidden className="arrow">→</span>
      </Link>
    </nav>
  );
}
