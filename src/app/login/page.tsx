export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">Login</p>
          <h1 className="mt-3 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Auth is configured. The interactive login form is the next UI slice to build.
          </p>
        </div>
      </div>
    </main>
  );
}
