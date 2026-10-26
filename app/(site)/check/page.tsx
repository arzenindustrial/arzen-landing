import type { Metadata } from "next";
import { FreeCheck } from "./free-check";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Free MTR check",
  description: "Upload one material test report and see which chemical elements are within the specification limits. No account. The file is not stored.",
};

export default function CheckPage() {
  return (
    <>
    <PageHero narrow tag="Free MTR check" title="Your MTR, checked against the specification."
      lead="Upload one certificate. You'll see a pass / deviation / review summary of the chemistry, in your browser." />
    <div className="relative">
    <div aria-hidden className="bp-grid-light absolute inset-0 opacity-60" />
    <div className="relative mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <div className="brackets -mt-8 rounded-lg bg-white p-5 shadow-[0_24px_60px_-36px_rgba(14,22,33,.5)] sm:p-8" style={{ ["--bs" as string]: "16px", ["--bw" as string]: "2px" }}><FreeCheck /></div>
      <section data-reveal aria-labelledby="data" className="mt-10 rounded-md border border-s100 bg-white p-5 text-[14.5px] leading-relaxed">
        <h2 id="data" className="font-semibold">What happens to your file</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-alloy">
          <li>It is processed in memory and discarded. We do not store the file or the values read from it.</li>
          <li>To read it, the file is sent over an encrypted connection to our document-reading providers (AWS Textract for OCR and Anthropic for extraction). They are listed on the trust page.</li>
          <li>We keep a daily count of checks per hashed IP address to prevent abuse. No name or email is needed.</li>
          <li>Please do not upload drawings, CAD files or export-controlled technical data. Arzen is for material certificates only.</li>
        </ul>
      </section>
    </div>
    </div>
    </>
  );
}
