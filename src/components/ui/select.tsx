import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-white/85 px-3 text-sm text-slate-900 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 dark:bg-slate-950/70 dark:text-slate-100",
        className,
      )}
      {...props}
    />
  );
}
