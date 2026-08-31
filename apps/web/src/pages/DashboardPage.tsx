
export function DashboardPage() {
  const cards = [
    { title: 'Identity', value: 'Owner bootstrap ready', detail: 'Central session auth is scaffolded in the worker app.' },
    { title: 'Modules', value: 'Knowledge Base installed', detail: 'Manifest-driven lifecycle hooks define install, activate, update, and rollback.' },
    { title: 'Operations', value: 'Audit + Events', detail: 'Edge routes emit auditable, versioned actions for future queue consumers.' },
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dashboard</h1>
        <p className="text-slate-600">This shell proves the first vertical slice structure and reserves space for richer operational widgets.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-[var(--radius-md)] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{card.title}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{card.value}</h2>
            <p className="mt-3 text-sm text-slate-600">{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
