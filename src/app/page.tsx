import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const features = [
  "Credentials auth with protected routes",
  "Project and team management with role-based access",
  "Task creation, assignment, and overdue tracking",
  "Dashboard for personal workload and project progress",
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <header className="flex flex-col gap-8 border-b border-zinc-800 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-400">
              Full-stack assignment setup
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Team task management app with project roles, assignments, and progress tracking.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-400">
                The project foundation is ready for auth, Prisma models, protected pages, and
                Railway deployment. We&apos;re set up to move from scaffold to product now.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-sky-500 px-5 text-sm font-medium text-zinc-950 transition hover:bg-sky-400"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-700 px-5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Log in
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm leading-6 text-zinc-300">{feature}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">What&apos;s already wired</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>Prisma schema for users, projects, project members, and tasks.</li>
              <li>NextAuth credentials configuration with bcrypt password checks.</li>
              <li>Signup API route and middleware-protected dashboard route.</li>
              <li>Environment templates and database scripts for local setup.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">Next implementation slice</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>1. Run the first Prisma migration against PostgreSQL.</li>
              <li>2. Build the login and signup forms.</li>
              <li>3. Add project CRUD and project-level role checks.</li>
              <li>4. Add task creation, assignment, and dashboard queries.</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
