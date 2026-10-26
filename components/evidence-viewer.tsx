"use client";
import { useEffect, useRef, useState } from "react";

export interface Highlight { page?: number | null; bbox?: number[] | null; label?: string }

/** Evidencia al lado (brand book §14): el original con un recuadro sobre el valor elegido.
 *  Renderiza con pdf.js en un canvas, así funciona aunque el navegador no tenga visor de PDF. */
export function EvidenceViewer({ url, kind, highlight }: { url: string; kind: "pdf" | "image"; highlight?: Highlight | null }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (kind !== "pdf") return;
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        const doc = await pdfjs.getDocument({ url, isEvalSupported: false }).promise;
        if (!cancelled) setPdf(doc);
      } catch {
        if (!cancelled) setError("The original couldn't be displayed here.");
      }
    })();
    return () => { cancelled = true; };
  }, [url, kind]);

  useEffect(() => {
    if (highlight?.page) setPage(highlight.page);
  }, [highlight]);

  useEffect(() => {
    if (!pdf || !canvas.current || !wrap.current) return;
    let task: any;
    (async () => {
      setRendering(true);
      const p = await pdf.getPage(Math.min(Math.max(page, 1), pdf.numPages));
      const base = p.getViewport({ scale: 1 });
      const cssWidth = wrap.current!.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      const viewport = p.getViewport({ scale: (cssWidth / base.width) * dpr });
      const c = canvas.current!;
      c.width = viewport.width;
      c.height = viewport.height;
      c.style.width = `${cssWidth}px`;
      c.style.height = `${viewport.height / dpr}px`;
      task = p.render({ canvasContext: c.getContext("2d")!, viewport });
      try { await task.promise; } catch {}
      setRendering(false);
    })();
    return () => { try { task?.cancel(); } catch {} };
  }, [pdf, page]);

  useEffect(() => {
    if (highlight?.bbox && box.current) box.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [highlight, page, rendering]);

  const showBox = highlight?.bbox && (kind === "image" || (highlight.page ?? 1) === page);
  const b = highlight?.bbox;
  const pad = 0.006;

  return (
    <div className="rounded-md border border-line bg-white">
      {kind === "pdf" && pdf && (
        <div className="flex items-center justify-between border-b border-line px-3 py-1.5 text-[12.5px] text-alloy">
          <button onClick={() => setPage((x) => Math.max(1, x - 1))} disabled={page <= 1} className="rounded px-2 py-0.5 disabled:opacity-40" aria-label="Previous page">←</button>
          <span className="num">Page {page} of {pdf.numPages}</span>
          <button onClick={() => setPage((x) => Math.min(pdf.numPages, x + 1))} disabled={page >= pdf.numPages} className="rounded px-2 py-0.5 disabled:opacity-40" aria-label="Next page">→</button>
        </div>
      )}
      <div ref={wrap} className="relative max-h-[640px] overflow-auto">
        {error ? <p className="p-6 text-[14px] text-alloy">{error}</p> : kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Original certificate" className="block w-full" />
        ) : <canvas ref={canvas} aria-label={`Original certificate, page ${page}`} role="img" className="block" />}
        {showBox && b && (
          <div ref={box} aria-hidden className="pointer-events-none absolute border-2 border-[#2350D9] bg-[#2350D9]/10"
            style={{ left: `${(b[0] - pad) * 100}%`, top: `${(b[1] - pad) * 100}%`, width: `${(b[2] - b[0] + 2 * pad) * 100}%`, height: `${(b[3] - b[1] + 2 * pad) * 100}%` }} />
        )}
      </div>
      {highlight?.label && (
        <p className="border-t border-line px-3 py-1.5 text-[12.5px] text-alloy" aria-live="polite">
          Showing {highlight.label}{highlight.page ? ` · page ${highlight.page}` : ""}{highlight.bbox ? "" : " (exact position not available)"}
        </p>
      )}
    </div>
  );
}
