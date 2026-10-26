import Link from "next/link";
import { Logo } from "@/components/brand";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-start justify-center gap-6 bg-paper px-6 sm:px-16">
      <Logo />
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-alloy">404</p>
      <h1 className="font-display text-[clamp(30px,5vw,48px)] font-bold">This page isn't on record.</h1>
      <p className="max-w-md text-[17px] text-alloy">The link may be old or mistyped.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="rounded bg-blue px-5 py-3 font-medium text-white">Go to the home page</Link>
        <Link href="/check" className="rounded border border-ink px-5 py-3 font-medium">Check an MTR free</Link>
      </div>
    </main>
  );
}
