import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const dashboardCards = [
  { label: "Assigned To Me", value: "0", tone: "text-sky-600" },
  { label: "In Progress", value: "0", tone: "text-amber-600" },
  { label: "Completed", value: "0", tone: "text-emerald-600" },
  { label: "Overdue", value: "0", tone: "text-rose-600" },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
            Team Task Manager
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Welcome back, {session.user.name}</h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400">
              Your dashboard shell is live. Next we&apos;ll connect these cards and sections to
              Prisma queries for projects, assignments, and overdue work.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => (
            <div key={card.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-400">{card.label}</p>
              <p className={`mt-4 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">Next build targets</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>Connect project and task queries to Prisma.</li>
              <li>Add project creation and membership management.</li>
              <li>Implement task creation, assignment, and status updates.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">Current user</h2>
            <dl className="mt-4 space-y-3 text-sm text-zinc-300">
              <div>
                <dt className="text-zinc-500">Name</dt>
                <dd>{session.user.name}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">User ID</dt>
                <dd className="break-all">{session.user.id}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
