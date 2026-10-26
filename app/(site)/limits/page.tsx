import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Arzen does not do",
  description: "Arzen checks material certificates against specification limits. It does not release material, replace your quality manager, or handle CAD or export-controlled data.",
};

const ITEMS: [string, string][] = [
  ["Arzen does not release or certify material.", "It checks the numbers on a certificate against the limits shown and documents the result. The decision to accept material stays with your quality team."],
  ["Arzen does not replace your quality manager or your QMS.", "It takes one repetitive task off their desk and leaves the judgment calls, marked for review, with them."],
  ["Arzen does not test material.", "It reads what the mill or lab reported. It cannot tell whether the reported values are true."],
  ["Arzen does not accept drawings, CAD, or export-controlled technical data.", "Upload material certificates only. Do not upload ITAR- or EAR-controlled technical data or controlled unclassified information."],
  ["Arzen does not convert hardness between scales without a licensed table.", "If a certificate reports Brinell and the limit is in Rockwell C, the value is marked for review instead of being converted by guesswork."],
  ["Arzen does not treat draft limits as final.", "Catalog entries not yet verified against the licensed standard can never produce a “within limits” result."],
  ["Arzen does not guess unreadable values.", "If a value is missing, illegible, or not found on the page, it is reported as such."],
];

export default function Limits() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-[clamp(34px,5vw,52px)] font-bold leading-tight">What Arzen does not do</h1>
      <p className="mt-3 text-[17px] text-alloy">Knowing the limits of a tool is part of trusting it.</p>
      <ol className="mt-10 space-y-6">
        {ITEMS.map(([t, d], i) => (
          <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-2">
            <span className="num pt-0.5 text-[14px] text-alloy">{String(i + 1).padStart(2, "0")}</span>
            <div><h2 className="text-[17px] font-semibold">{t}</h2><p className="mt-1.5 text-[15.5px] leading-relaxed text-alloy">{d}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}
