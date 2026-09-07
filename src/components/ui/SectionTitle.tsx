interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function SectionTitle({ eyebrow, title, description, action }: SectionTitleProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-heading">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}