
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/app', label: 'Dashboard' },
  { to: '/app/modules', label: 'Modules' },
  { to: '/app/knowledge-base', label: 'Knowledge Base' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-canvas)] text-[var(--color-text-default)] lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-slate-200 bg-[var(--color-surface-inverse)] p-6 text-[var(--color-text-inverse)] lg:min-h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
        <h2 className="text-xl font-semibold">Community Platform OS</h2>
        <nav aria-label="Primary" className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-[var(--radius-sm)] px-3 py-2 text-sm transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
