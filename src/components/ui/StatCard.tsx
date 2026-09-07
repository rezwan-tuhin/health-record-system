import clsx from "clsx";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  tone?: "teal" | "sky" | "amber" | "red" | "violet" | "green";
  index?: number;
}

const tones: Record<string, { wrapper: string; icon: string; ring: string }> = {
  teal: { wrapper: "bg-teal-500/15", icon: "text-teal-300", ring: "glow-teal" },
  sky: { wrapper: "bg-sky-500/15", icon: "text-sky-300", ring: "glow-blue" },
  amber: { wrapper: "bg-amber-500/15", icon: "text-amber-300", ring: "glow-amber" },
  red: { wrapper: "bg-red-500/15", icon: "text-red-300", ring: "glow-red" },
  violet: { wrapper: "bg-violet-500/15", icon: "text-violet-300", ring: "" },
  green: { wrapper: "bg-emerald-500/15", icon: "text-emerald-300", ring: "" },
};

export default function StatCard({ icon: Icon, label, value, sub, tone = "teal", index = 0 }: StatCardProps) {
  const t = tones[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={clsx("panel flex items-center gap-4 rounded-2xl p-5", t.ring)}
    >
      <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", t.wrapper)}>
        <Icon className={clsx("h-6 w-6", t.icon)} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</p>
        <p className="truncate text-2xl font-bold text-heading">{value}</p>
        {sub && <p className="truncate text-xs text-muted">{sub}</p>}
      </div>
    </motion.div>
  );
}