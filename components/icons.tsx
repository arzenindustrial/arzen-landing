// Iconografía: cuadrícula 24 px, trazo 1.75 px, terminación cuadrada, esquinas a 90° (brand book §09).
// Prohibido: engranes, rayos, cerebros, destellos.
type P = { className?: string; size?: number };
const base = (size = 24) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.75, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const, "aria-hidden": true,
});

export const IconUpload = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4 14v6h16v-6" /></svg>
);
export const IconExtract = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 3h10l4 4v14H5z M9 10h6M9 14h6M9 18h3" /><path d="M2 12h20" stroke="var(--blue)" /></svg>
);
export const IconValidate = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4 4h16v16H4z M8 12.5l2.5 2.5L16 9" /></svg>
);
export const IconExport = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M14 3h6v6M20 3l-9 9M18 14v6H4V6h6" /></svg>
);
export const IconStandards = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 3h13v18H5z" /><rect x="5" y="3" width="3" height="18" fill="currentColor" stroke="none" /><path d="M11 8h4M11 12h4" /></svg>
);
export const IconDeviation = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3 2.5 20h19z M12 10v4.5M12 17v.5" /></svg>
);
