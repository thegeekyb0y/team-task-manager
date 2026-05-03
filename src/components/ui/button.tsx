import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_14px_30px_rgba(79,70,229,0.25)] hover:bg-primary-strong",
  secondary:
    "border border-border bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_14px_30px_rgba(225,29,72,0.2)]",
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium whitespace-nowrap disabled:pointer-events-none disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
