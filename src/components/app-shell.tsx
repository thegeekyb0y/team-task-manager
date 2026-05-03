"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ListChecks, SignOut, SquaresFour, User } from "@phosphor-icons/react";
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
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
                O
              </div>
              <span className="text-lg font-semibold">Orbit</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon size={18} weight={active ? "fill" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex items-center gap-3 rounded-md bg-accent px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <User
                  size={16}
                  weight="bold"
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-accent hover:text-foreground"
            >
              <SignOut size={18} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-card px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-1 text-sm text-muted">{subtitle}</p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex items-center gap-3">{actions}</div>
              ) : null}
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
