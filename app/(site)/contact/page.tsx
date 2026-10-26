import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { IconLock, IconMail } from "@/components/icons";
import { isDemo } from "@/lib/demo";
import { stagger } from "@/lib/motion";
import { CONTACT_EMAIL, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request early access to Arzen or ask about data handling. Write to the Arzen team by email.",
  alternates: { canonical: "/contact" },
};

const EARLY_ACCESS_BODY = [
  "Company:",
  "Your role:",
  "Certificates (MTRs) per month, roughly:",
  "Materials or specifications you check most:",
  "How you check them today:",
  "",
  "(Please don't attach certificates or drawings to this email.)",
].join("\n");

export default function Contact() {
  const cards = [
    {
      Icon: IconMail, tag: "Early access", title: "Try Arzen on your certificates",
      d: "Tell us about your shop and the specifications you check most. We open accounts in order and reply with next steps.",
      href: mailto("Arzen early access", EARLY_ACCESS_BODY), cta: "Request early access",
    },
    {
      Icon: IconLock, tag: "Data & security", title: "Ask about data handling",
      d: "Questions about storage, retention, subprocessors or what you should not upload. The trust center answers most of them.",
      href: mailto("Arzen data and security question"), cta: "Email a question",
    },
  ];
  return (
    <>
    <PageHero narrow tag="Contact" title="Talk to Arzen"
      lead={isDemo()
        ? "Accounts are opening in stages. Until yours is ready, the free check and the dashboard on this site run on labeled sample data."
        : "Questions about plans, data handling or a certificate that didn't read well. Write to us."} />
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <ul className="grid gap-5 sm:grid-cols-2">
        {cards.map(({ Icon, tag, title, d, href, cta }, i) => (
          <li key={tag} data-reveal style={stagger(i, 100)}>
            <a href={href} className="card-lift group flex h-full flex-col rounded-md border border-s100 bg-white p-6">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-ink text-paper"><Icon size={18} /></span>
                <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-alloy">{tag}</span>
              </span>
              <span className="mt-4 text-[19px] font-semibold">{title}</span>
              <span className="mt-2 flex-1 text-[15px] leading-relaxed text-alloy">{d}</span>
              <span className="mt-5 inline-flex items-center gap-1.5 font-medium text-blue">{cta} <span aria-hidden className="arrow">→</span></span>
            </a>
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-8 rounded-md border border-s100 bg-white p-5 text-[15px]">
        <p>Email: <a href={`mailto:${CONTACT_EMAIL}`} className="num font-medium text-blue underline-offset-2 hover:underline">{CONTACT_EMAIL}</a></p>
        <p className="mt-2 text-alloy">
          Don&apos;t send certificates, drawings, CAD or export-controlled technical data by email.
          See <Link href="/limits" className="font-medium text-ink underline underline-offset-2">what Arzen does not do</Link> and
          the <Link href="/trust" className="font-medium text-ink underline underline-offset-2">trust center</Link>.
        </p>
      </div>
    </div>
    </>
  );
}
