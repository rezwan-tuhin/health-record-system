interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center justify-center rounded-2xl px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-muted">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-heading">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 rounded-xl bg-teal-500/15 px-4 py-2 text-sm font-semibold text-teal-300 transition-colors hover:bg-teal-500/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}