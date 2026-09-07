"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "danger" | "ghost" | "outline" | "warning";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_18px_-6px_rgba(20,184,166,0.7)]",
  danger:
    "bg-red-500/90 text-white hover:bg-red-400 shadow-[0_0_18px_-6px_rgba(239,68,68,0.7)]",
  warning:
    "bg-amber-500/90 text-slate-950 hover:bg-amber-400 shadow-[0_0_18px_-6px_rgba(245,158,11,0.7)]",
  outline:
    "border border-line bg-white/5 text-body hover:bg-white/10 hover:text-heading",
  ghost: "bg-transparent text-body hover:bg-white/5 hover:text-heading",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}