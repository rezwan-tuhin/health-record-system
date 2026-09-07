import clsx from "clsx";

type BadgeTone = "teal" | "sky" | "violet" | "amber" | "red" | "green" | "slate";

const tones: Record<BadgeTone, string> = {
  teal: "bg-teal-500/15 text-teal-300",
  sky: "bg-sky-500/15 text-sky-300",
  violet: "bg-violet-500/15 text-violet-300",
  amber: "bg-amber-500/15 text-amber-300",
  red: "bg-red-500/15 text-red-300",
  green: "bg-emerald-500/15 text-emerald-300",
  slate: "bg-slate-500/15 text-slate-300",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
}

export default function Badge({
  tone = "slate",
  dot = false,
  pulse = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className
      )}
      {...rest}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}