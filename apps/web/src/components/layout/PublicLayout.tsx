
import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <main className="min-h-screen bg-[var(--color-surface-canvas)] px-4 py-8 text-[var(--color-text-default)] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-4">
          <span className="inline-flex rounded-[var(--radius-pill)] bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
            Cloudflare-native Community Platform OS
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Run communities, workflows, and knowledge from one modular platform.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            The first vertical slice ships secure owner bootstrap, centralized identity, and a knowledge-base module scaffold designed for future marketplace distribution.
          </p>
        </section>
        <section className="rounded-[var(--radius-md)] bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
