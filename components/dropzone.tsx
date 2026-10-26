"use client";
import { useRef, useState } from "react";
import { IconUpload } from "./icons";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.tif,.tiff,application/pdf,image/jpeg,image/png,image/tiff";

/** Zona de carga: vacío (borde punteado azul), arrastrando (relleno Info), leyendo, error con causa y acción. */
export function Dropzone({ onFiles, busy, busyText, multiple = false, compact = false }: {
  onFiles: (files: File[]) => void; busy?: boolean; busyText?: string; multiple?: boolean; compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const pick = (list: FileList | null) => {
    if (!list || busy) return;
    const files = Array.from(list);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}
      className={`rounded-lg border-2 border-dashed border-blue text-center transition-colors ${over ? "bg-infobg" : "bg-surface"} ${compact ? "p-6" : "p-8 sm:p-10"}`}
    >
      <input ref={input} type="file" accept={ACCEPT} multiple={multiple} className="sr-only" id="mtr-file"
        onChange={(e) => { pick(e.target.files); e.target.value = ""; }} disabled={busy} />
      {busy ? (
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
          <div className="h-1 w-40 overflow-hidden rounded bg-s100">
            <div className="scan-line h-full w-full bg-blue" style={{ animationIterationCount: "infinite", animationDuration: "1.2s" }} />
          </div>
          <p className="font-medium">{busyText || "Reading the certificate…"}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <IconUpload className="text-blue" size={28} />
          <p className="font-medium">
            Drag {multiple ? "MTRs" : "an MTR"} here or{" "}
            <label htmlFor="mtr-file" className="cursor-pointer text-blue underline underline-offset-2">browse</label>
          </p>
          <p className="text-[13px] text-muted">PDF · JPG · PNG · TIFF · up to 25 MB{multiple ? " each · multiple files OK" : ""}</p>
        </div>
      )}
    </div>
  );
}
