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

// Industrias (mismas reglas: trazo, esquinas a 90°, sin engranes).
export const IconAerospace = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 2.5v19M12 9 3 14v2l9-2.5L21 16v-2zM9 20l3-1.5 3 1.5" /></svg>
);
export const IconMedical = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M9 3h6v4H9zM10 7h4v12l-2 2.5-2-2.5zM10 10.5h4M10 13.5h4M10 16.5h4" /></svg>
);
export const IconEnergy = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M2 9.5h5v5H2zM17 9.5h5v5h-5zM7 11h10M7 13h10M9.5 4.5h5v5h-5z" /><path d="M12 9.5v1.5" /></svg>
);
export const IconAutomotive = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M6 3h12v7H6zM6 6h12M6 8h12M9.5 10l1.5 6h2l1.5-6M10 16h4v5h-4z" /></svg>
);
export const IconLock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 10h14v11H5zM8 10V4h8v6M12 14v3" /></svg>
);
export const IconChain = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 8h7v8H3zM14 8h7v8h-7zM10 12h4" /></svg>
);
export const IconEye = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" /><path d="M10 10h4v4h-4z" /></svg>
);
export const IconMail = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 5h18v14H3zM3 5l9 7.5L21 5" /></svg>
);
