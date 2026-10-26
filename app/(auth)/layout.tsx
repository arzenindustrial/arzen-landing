import Link from "next/link";
import { Logo } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="mx-auto w-full max-w-page px-4 py-5 sm:px-6"><Link href="/" aria-label="Arzen home"><Logo /></Link></header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-6">{children}</main>
    </div>
  );
}
