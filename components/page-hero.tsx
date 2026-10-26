/** Banda de entrada de las páginas internas: Ink con retícula de plano, igual que la home. */
export function PageHero({ tag, title, lead, children, narrow = false }: {
  tag: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode; narrow?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="bp-grid bp-fade absolute inset-0" />
      <div className={`relative mx-auto px-4 pb-14 pt-14 sm:px-6 md:pb-16 md:pt-16 ${narrow ? "max-w-3xl" : "max-w-page"}`}>
        <p className="hx-in inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-[var(--blue-on-ink)]" style={{ ["--t" as string]: "0ms" }}>
          <span aria-hidden className="h-[2px] w-5 bg-[var(--blue-on-ink)]" />{tag}
        </p>
        <h1 className="hx-in font-display mt-4 max-w-3xl text-[clamp(34px,5vw,56px)] font-bold leading-[1.04]" style={{ ["--t" as string]: "80ms" }}>{title}</h1>
        {lead && <p className="hx-in mt-5 max-w-2xl text-[17.5px] leading-relaxed text-s300" style={{ ["--t" as string]: "160ms" }}>{lead}</p>}
        {children && <div className="hx-in mt-7" style={{ ["--t" as string]: "240ms" }}>{children}</div>}
      </div>
    </section>
  );
}
