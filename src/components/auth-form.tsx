"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground text-lg font-bold">
              O
            </div>
            <h1 className="text-2xl font-semibold">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {isSignup
                ? "Start managing your team's tasks"
                : "Sign in to your workspace"}
            </p>
          </div>

          <div className="card rounded-lg p-6">
            <form action={handleSubmit} className="space-y-4">
              {isSignup ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input name="name" placeholder="John Doe" required />
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error ? (
                <div className="border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <SpinnerGap size={18} className="animate-spin" />
                ) : null}
                {isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="font-medium text-primary hover:underline"
              >
                {isSignup ? "Sign in" : "Create one"}
              </Link>
            </p>

            <div className="mt-6 border border-border bg-accent p-3 text-xs text-muted">
              <strong>Demo:</strong> admin@example.com / password123
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
