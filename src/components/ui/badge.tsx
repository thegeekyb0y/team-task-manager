import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-slate-900/[0.05] text-slate-600 dark:bg-white/[0.08] dark:text-slate-300",
  primary: "bg-primary-soft text-primary dark:text-indigo-200",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
