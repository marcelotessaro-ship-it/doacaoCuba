import { useState } from 'react';
import { HandHeart, Mail, User as UserIcon } from 'lucide-react';
import { PageBackground } from '../components/layout/PageBackground';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DonationFlowModal } from '../components/donation/DonationFlowModal';
import { useAuth } from '../hooks/useAuth';
import { useDonations } from '../hooks/useDonations';
import { formatCurrencyBRL, formatDateTime } from '../utils/formatters';
import { PAYMENT_METHOD_META } from '../utils/constants';

export function VisitorPanelPage() {
  const { user } = useAuth();
  const { donations, isLoading } = useDonations();
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  if (!user) return null;

  return (
    <PageBackground>
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-50">Olá, {user.name.split(' ')[0]}</h1>
            <p className="text-sm text-slate-400">Este é o seu painel de doações.</p>
          </div>
          <Button onClick={() => setIsDonationOpen(true)}>
            <HandHeart size={18} />
            Nova doação
          </Button>
        </div>

        {/* RF-17 — own profile data */}
        <GlassCard className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-100">Meus dados</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <UserIcon size={16} />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-400">Nome</dt>
                <dd className="text-sm text-slate-100">{user.name}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                <Mail size={16} />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-400">E-mail</dt>
                <dd className="text-sm text-slate-100">{user.email}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Total doado</p>
            <p className="mt-1 text-2xl font-black text-emerald-400">{formatCurrencyBRL(user.total_donated)}</p>
          </div>
        </GlassCard>

        {/* RF-18 — own donation history */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-slate-100">Histórico de doações</h2>

          {isLoading && <p className="text-sm text-slate-400">Carregando...</p>}

          {!isLoading && donations.length === 0 && (
            <GlassCard className="text-center text-sm text-slate-400">
              Você ainda não fez nenhuma doação.
            </GlassCard>
          )}

          <div className="flex flex-col gap-3">
            {donations.map((donation) => (
              <GlassCard key={donation.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs text-cyan-300">{donation.transaction_hash}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {PAYMENT_METHOD_META[donation.payment_method].label} · {formatDateTime(donation.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={donation.status} />
                  <span className="font-mono text-lg font-bold text-slate-50">
                    {formatCurrencyBRL(donation.amount)}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <DonationFlowModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </PageBackground>
  );
}
