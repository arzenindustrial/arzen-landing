import Link from "next/link";
import type { DocSummary } from "@/lib/types";
import { INDUSTRY_LABEL, isoDate } from "@/lib/format";
import { CountsLine, StatusBadge } from "./status";

export function CertTable({ items, highlight }: { items: DocSummary[]; highlight?: string }) {
  if (!items.length) {
    return <p className="rounded-md border border-line bg-surface px-4 py-8 text-center text-muted">No certificates yet. Upload your first MTR.</p>;
  }
  const mark = (text: string) => {
    if (!highlight) return text;
    const i = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (i < 0) return text;
    return <>{text.slice(0, i)}<mark className="bg-infobg text-blue">{text.slice(i, i + highlight.length)}</mark>{text.slice(i + highlight.length)}</>;
  };
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full min-w-[760px] border-collapse bg-surface text-[13.5px]">
        <thead>
          <tr className="border-b border-line text-left text-muted">
            <th scope="col" className="px-3 py-2 font-medium">Status</th>
            <th scope="col" className="px-3 py-2 font-medium">Heat</th>
            <th scope="col" className="px-3 py-2 font-medium">Specification</th>
            <th scope="col" className="px-3 py-2 font-medium">Mill</th>
            <th scope="col" className="px-3 py-2 font-medium">Checks</th>
            <th scope="col" className="px-3 py-2 font-medium">Processed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.id} className="border-t border-line hover:bg-surface2">
              <td className="px-3 py-2.5"><StatusBadge status={d.validation_status} /></td>
              <td className="num px-3 py-2.5">
                <Link href={`/app/certificates/${d.id}`} className="font-medium underline-offset-2 hover:underline">{mark(d.heat_number)}</Link>
                <div className="font-sans text-[12px] text-muted">{d.original_filename}</div>
              </td>
              <td className="px-3 py-2.5">
                {d.spec_code ? <><span className="num">{d.spec_code}{d.spec_revision ? `-${d.spec_revision}` : ""}</span><div className="text-[12px] text-muted">{d.alloy}</div></> : <span className="text-muted">Not matched</span>}
              </td>
              <td className="px-3 py-2.5 text-muted">{d.mill_name ? mark(d.mill_name) : "—"}</td>
              <td className="px-3 py-2.5"><CountsLine counts={d.counts} hideZero /></td>
              <td className="num px-3 py-2.5 text-muted">{isoDate(d.processed_at)}<div className="font-sans text-[12px]">{INDUSTRY_LABEL[d.industry_sector]}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
