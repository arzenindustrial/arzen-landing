import type { Metadata } from "next";
import { FreeCheck } from "./free-check";

export const metadata: Metadata = {
  title: "Free MTR check",
  description: "Upload one material test report and see which chemical elements are within the specification limits. No account. The file is not stored.",
};

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-alloy">Free MTR check</p>
      <h1 className="font-display mt-3 text-[clamp(32px,5vw,48px)] font-bold leading-tight">Your MTR, checked against the specification.</h1>
      <p className="mt-4 text-[17px] text-alloy">Upload one certificate. You'll see a pass / deviation / review summary of the chemistry, in your browser.</p>
      <div className="mt-8"><FreeCheck /></div>
      <section aria-labelledby="data" className="mt-10 rounded-md border border-s100 bg-white p-5 text-[14.5px] leading-relaxed">
        <h2 id="data" className="font-semibold">What happens to your file</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-alloy">
          <li>It is processed in memory and discarded. We do not store the file or the values read from it.</li>
          <li>To read it, the file is sent over an encrypted connection to our document-reading providers (AWS Textract for OCR and Anthropic for extraction). They are listed on the trust page.</li>
          <li>We keep a daily count of checks per hashed IP address to prevent abuse. No name or email is needed.</li>
          <li>Please do not upload drawings, CAD files or export-controlled technical data. Arzen is for material certificates only.</li>
        </ul>
      </section>
    </div>
  );
}
