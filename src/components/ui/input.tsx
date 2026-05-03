import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-white/85 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-500",
        className,
      )}
      {...props}
    />
  );
}
