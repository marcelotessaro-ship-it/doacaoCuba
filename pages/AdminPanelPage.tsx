import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { PageBackground } from '../components/layout/PageBackground';
import { Navbar } from '../components/layout/Navbar';
import { Input } from '../components/ui/Input';
import { KpiRow } from '../components/admin/KpiRow';
import { VisitorsTable } from '../components/admin/VisitorsTable';
import { DonationsTable } from '../components/admin/DonationsTable';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { adminService } from '../services/adminService';
import { ApiError } from '../services/apiClient';
import type { Donation, KpiSummary, User } from '../utils/types';

type Tab = 'donations' | 'visitors';

export function AdminPanelPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('donations');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const [stats, setStats] = useState<KpiSummary | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const [visitors, setVisitors] = useState<User[]>([]);
  const [isVisitorsLoading, setIsVisitorsLoading] = useState(false);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [isDonationsLoading, setIsDonationsLoading] = useState(false);

  useEffect(() => {
    adminService
      .getStats()
      .then(setStats)
      .catch((err) => showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar os indicadores.', 'error'))
      .finally(() => setIsStatsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === 'visitors') {
      setIsVisitorsLoading(true);
      adminService
        .listVisitors(debouncedSearch || undefined)
        .then((result) => setVisitors(result.visitors))
        .catch((err) => showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar os visitantes.', 'error'))
        .finally(() => setIsVisitorsLoading(false));
    } else {
      setIsDonationsLoading(true);
      adminService
        .listDonations({ search: debouncedSearch || undefined })
        .then((result) => setDonations(result.donations))
        .catch((err) => showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar as doações.', 'error'))
        .finally(() => setIsDonationsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, debouncedSearch]);

  return (
    <PageBackground>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-8">
        <h1 className="text-3xl font-black text-slate-50">Painel Administrativo</h1>
        <p className="text-sm text-slate-400">Visão geral de doações e visitantes cadastrados.</p>

        {/* RF-22 — KPI indicators */}
        <div className="mt-8">
          <KpiRow stats={stats} isLoading={isStatsLoading} />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('donations')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === 'donations' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950' : 'glass-panel-light text-slate-300'
              }`}
            >
              Doações
            </button>
            <button
              onClick={() => setTab('visitors')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === 'visitors' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950' : 'glass-panel-light text-slate-300'
              }`}
            >
              Visitantes
            </button>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder={tab === 'donations' ? 'Buscar por doador, e-mail ou transação...' : 'Buscar por nome ou e-mail...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
            />
          </div>
        </div>

        <div className="mt-6">
          {tab === 'donations' ? (
            <DonationsTable donations={donations} isLoading={isDonationsLoading} />
          ) : (
            <VisitorsTable visitors={visitors} isLoading={isVisitorsLoading} />
          )}
        </div>

        {!isDonationsLoading && !isVisitorsLoading && search && (
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Search size={12} /> Resultados filtrados para “{search}”
          </p>
        )}
      </main>
    </PageBackground>
  );
}
