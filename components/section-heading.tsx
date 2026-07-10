type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead?: string;
};

export function SectionHeading({ eyebrow, title, lead }: SectionHeadingProps) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green">{eyebrow}</p>
      <h2 className="text-balance text-2xl font-medium leading-snug sm:text-3xl md:text-5xl md:leading-tight">{title}</h2>
      {lead ? <p className="mt-5 text-sm leading-7 text-muted sm:text-base md:mt-6 md:text-lg md:leading-8">{lead}</p> : null}
    </div>
  );
}
