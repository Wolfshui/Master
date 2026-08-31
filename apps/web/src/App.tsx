
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-[var(--radius-md)] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<SetupPage />} />
        </Route>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="modules"
            element={<PlaceholderPage title="Modules" description="Module lifecycle, entitlement, and rollout management will live here." />}
          />
          <Route
            path="knowledge-base"
            element={<PlaceholderPage title="Knowledge Base" description="Knowledge-base CRUD will use the worker module routes created in this scaffold." />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
