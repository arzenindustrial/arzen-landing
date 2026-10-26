import { ResultBadge } from "./status";

/** "Messy in, clean out" (brand book §09): el MTR torcido y resaltado a mano se convierte en la tabla del producto.
 *  Una línea azul de lectura une ambos lados. Datos de muestra rotulados. */
export function TransformVisual() {
  return (
    <figure className="relative" aria-label="A scanned mill certificate turned into a results table. Sample data.">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] sm:items-center">
        <div className="relative -rotate-2 overflow-hidden whitespace-nowrap rounded border border-s300 bg-[#fbfaf6] p-4 font-mono text-[11px] leading-relaxed text-s500 shadow-[0_1px_0_#e6e8eb]">
          <p className="font-semibold tracking-wide text-alloy">MILL TEST REPORT</p>
          <p>Heat: 0Y7K-2291</p>
          <p>Spec: ASTM F136</p>
          <p className="mt-2">Al 6.10&nbsp; V 4.00</p>
          <p><mark className="bg-[#fff1a8] px-0.5 text-s500">Fe 0.27</mark>&nbsp; O 0.11</p>
          <p>C 0.02&nbsp; N 0.01</p>
          <p>H 0.0045</p>
          <p className="mt-2"><mark className="bg-[#fff1a8] px-0.5 text-s500">UTS 131.3 ksi</mark></p>
          <p>YS 120.4 ksi&nbsp; El 14 %</p>
        </div>
        <div className="overflow-hidden rounded-md border border-s300 bg-white">
          <div className="flex items-center justify-between rounded-t-md bg-ink px-3 py-2 font-mono text-[11px] text-paper">
            <span className="truncate">Ti-6Al-4V ELI · 0Y7K-2291</span><span className="shrink-0 pl-2 text-s300">SAMPLE</span>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="text-left text-alloy">
              <tr><th className="px-2 py-1.5 font-medium">Element</th><th className="px-2 py-1.5 text-right font-medium">Value</th><th className="px-2 py-1.5 text-right font-medium">Limit</th><th className="px-2 py-1.5 font-medium">Result</th></tr>
            </thead>
            <tbody className="num whitespace-nowrap">
              <tr className="border-t border-s100 bg-devbg"><td className="px-2 py-1.5 font-sans">Fe</td><td className="px-2 text-right">0.27 %</td><td className="px-2 text-right">≤ 0.25 %</td><td className="px-2"><ResultBadge compact result="DEVIATION" /></td></tr>
              <tr className="border-t border-s100"><td className="px-2 py-1.5 font-sans">O</td><td className="px-2 text-right">0.11 %</td><td className="px-2 text-right">≤ 0.13 %</td><td className="px-2"><ResultBadge compact result="PASS" /></td></tr>
              <tr className="border-t border-s100"><td className="px-2 py-1.5 font-sans">Al</td><td className="px-2 text-right">6.10 %</td><td className="px-2 text-right">5.50–6.50 %</td><td className="px-2"><ResultBadge compact result="PASS" /></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div aria-hidden className="scan-line pointer-events-none absolute left-[-12px] right-[-12px] top-1/2 h-[3px] bg-blue/80" />
      <figcaption className="mt-3 font-mono text-[11px] text-alloy">Sample data. Values and limits are illustrative.</figcaption>
    </figure>
  );
}
