export default function SignupPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">Signup</p>
          <h1 className="mt-3 text-2xl font-semibold">Create an account</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            The signup API is ready. Next we&apos;ll connect a client form to this route and
            auto-sign users in after registration.
          </p>
        </div>
      </div>
    </main>
  );
}
