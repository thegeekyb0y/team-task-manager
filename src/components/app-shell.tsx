"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Kanban,
  Lightning,
  ListChecks,
  SignOut,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/projects", label: "Projects", icon: ListChecks },
];

export function AppShell({
  children,
  title,
  subtitle,
  user,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  user: { name: string; email: string };
  actions?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-3 py-3 sm:px-4 lg:px-6 lg:py-6">
        <aside className="surface hidden w-[272px] shrink-0 rounded-[28px] border border-white/10 px-5 py-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2 pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_18px_40px_rgba(79,70,229,0.35)]">
              <Lightning size={22} weight="fill" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Orbit</p>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Team Task Manager
              </h2>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium",
                    active
                      ? "bg-primary-soft text-primary dark:text-indigo-200"
                      : "text-slate-600 hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white",
                  )}
                >
                  <Icon size={18} weight={active ? "fill" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/60 p-4 dark:bg-slate-950/40">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary-soft p-2 text-primary dark:text-indigo-200">
                <Kanban size={20} weight="fill" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Assignment focus
                </p>
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Keep the workflow tight: auth, projects, roles, tasks, and a board that feels
                  production-ready.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-8">
            <div className="rounded-[24px] border border-white/10 bg-white/60 p-4 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/5 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  <UsersThree size={20} weight="duotone" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-950/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white"
            >
              <SignOut size={18} />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="surface rounded-[28px] border border-white/10 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                    <Lightning size={20} weight="fill" />
                  </div>
                  <span className="text-lg font-semibold text-slate-950 dark:text-white">Orbit</span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h1>
                  {subtitle ? (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>

              {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
            </div>
          </header>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
