"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type ReactNode, useState, useTransition } from "react";
import { CheckCircle, Lightning, SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(formData: FormData) {
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    startTransition(async () => {
      if (isSignup) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const payload = await response.json();

        if (!response.ok) {
          setError(payload.message ?? "Could not create your account.");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("We couldn't sign you in with those credentials.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 lg:py-6">
        <section className="surface hidden rounded-[28px] border border-white/10 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_18px_40px_rgba(79,70,229,0.35)]">
                <Lightning size={22} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Orbit</p>
                <h1 className="text-xl font-semibold text-slate-950 dark:text-white">
                  Team Task Manager
                </h1>
              </div>
            </div>

            <div className="max-w-xl space-y-6">
              <Badge tone="primary" className="rounded-full px-3 py-1.5 text-[11px] uppercase">
                Assignment ready
              </Badge>
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold leading-tight text-slate-950 dark:text-white">
                  Coordinate projects, assignments, and delivery with the same calm polish your
                  team expects from modern product software.
                </h2>
                <p className="max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
                  Clean auth, project roles, task tracking, and a dashboard that keeps work visible
                  without turning the app into noise.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Project-level roles for admins and members",
                "Overdue and status-aware dashboard metrics",
                "Clear project and task surfaces built for scanning",
                "Production-safe Prisma and NextAuth foundation",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/65 p-4 dark:bg-slate-950/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-300">
                      <CheckCircle size={16} weight="fill" />
                    </div>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-12">
            {[
              { label: "Projects", value: "12" },
              { label: "Tasks", value: "84" },
              { label: "Overdue", value: "3" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/65 p-4 dark:bg-slate-950/40"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-center justify-center lg:min-h-0">
          <div className="surface w-full max-w-md rounded-[28px] border border-white/10 p-6 sm:p-8">
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                  <Lightning size={20} weight="fill" />
                </div>
                <span className="text-lg font-semibold text-slate-950 dark:text-white">Orbit</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
                  {isSignup ? "Create your workspace access" : "Welcome back"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {isSignup
                    ? "Start with a clean account, then create a project and assign your first sprint."
                    : "Sign in to manage projects, members, and task delivery."}
                </p>
              </div>
            </div>

            <form action={handleSubmit} className="space-y-5">
              {isSignup ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Full name
                  </label>
                  <Input name="name" placeholder="Ayaan Malik" required />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <Input name="email" type="email" placeholder="you@company.com" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <Input name="password" type="password" placeholder="********" required />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? <SpinnerGap size={18} className="animate-spin" /> : null}
                {isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="font-medium text-primary hover:text-primary-strong"
              >
                {isSignup ? "Sign in" : "Create one"}
              </Link>
            </p>

            <div
              className={cn(
                "mt-8 rounded-2xl border border-white/10 px-4 py-4 text-sm leading-6 text-slate-500 dark:text-slate-400",
                "bg-slate-950/[0.03] dark:bg-white/[0.03]",
              )}
            >
              Demo credentials:{" "}
              <span className="font-medium text-slate-800 dark:text-slate-100">admin@example.com</span>{" "}
              /{" "}
              <span className="font-medium text-slate-800 dark:text-slate-100">password123</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "primary";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-xs font-medium",
        tone === "primary"
          ? "bg-primary-soft text-primary dark:text-indigo-200"
          : "bg-slate-900/5 text-slate-600 dark:bg-white/8 dark:text-slate-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
