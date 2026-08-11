import { useState } from 'react';
import { HandHeart, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { PageBackground } from '../components/layout/PageBackground';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { DonationFlowModal } from '../components/donation/DonationFlowModal';

export function LandingPage() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <PageBackground>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
        {/* Hero — RF-06 */}
        <section className="flex flex-col items-center text-center">
          <span className="glass-panel-light mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Crise humanitária em curso
          </span>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-50 sm:text-6xl">
            Ajude a levar{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              esperança
            </span>{' '}
            ao povo cubano
          </h1>

          <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            Cuba enfrenta uma das piores crises econômicas de sua história. Sua doação ajuda a levar
            alimentos, remédios e apoio direto a quem mais precisa.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => setIsDonationOpen(true)}>
              <HandHeart size={20} />
              Doe agora
            </Button>
          </div>

          {/* Stats ticker */}
          <div className="glass-panel mt-14 grid w-full max-w-2xl grid-cols-1 divide-y divide-white/10 rounded-3xl sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 py-5 text-center">
              <p className="text-2xl font-black text-emerald-400">100%</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">Transparente</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-2xl font-black text-blue-400">24/7</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">Acompanhamento</p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-2xl font-black text-cyan-400">0%</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">Taxa administrativa</p>
            </div>
          </div>
        </section>

        {/* Impact / transparency — RF-07 */}
        <section className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-black text-slate-50 sm:text-3xl">Seu impacto, com transparência total</h2>
            <p className="mt-3 text-slate-400">
              Cada doação é registrada e acompanhada. Você pode consultar a qualquer momento seu histórico
              e ver exatamente como sua contribuição está sendo utilizada.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <GlassCard hover>
              <ShieldCheck className="text-emerald-400" size={24} />
              <h3 className="mt-4 font-bold text-slate-100">Segurança em primeiro lugar</h3>
              <p className="mt-2 text-sm text-slate-400">
                Seus dados pessoais são protegidos conforme a LGPD e nunca compartilhados sem consentimento.
              </p>
            </GlassCard>
            <GlassCard hover>
              <TrendingUp className="text-blue-400" size={24} />
              <h3 className="mt-4 font-bold text-slate-100">Acompanhamento em tempo real</h3>
              <p className="mt-2 text-sm text-slate-400">
                Acesse seu painel pessoal e veja o histórico completo de todas as suas doações.
              </p>
            </GlassCard>
            <GlassCard hover>
              <Sparkles className="text-cyan-400" size={24} />
              <h3 className="mt-4 font-bold text-slate-100">Impacto direto</h3>
              <p className="mt-2 text-sm text-slate-400">
                Cada real doado é direcionado para apoiar famílias cubanas em situação de vulnerabilidade.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />

      <DonationFlowModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </PageBackground>
  );
}
