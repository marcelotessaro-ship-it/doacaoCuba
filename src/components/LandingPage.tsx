import React, { useState } from 'react';
import { ImpactReport, SystemStats } from '../types';
import { 
  Heart, 
  ShieldCheck, 
  Zap,
  Pill,
  ShoppingBag,
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Users, 
  TrendingUp, 
  Lock, 
  Sparkles,
  HelpCircle,
  FileCheck2,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  stats: SystemStats;
  impactReports: ImpactReport[];
  onOpenDonateModalWithAmount: (amount: number) => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigateRegions?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  impactReports,
  onOpenDonateModalWithAmount,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateRegions,
}) => {
  const [selectedCalcValue, setSelectedCalcValue] = useState<number>(5);

  const impactOptions = [
    { value: 5, title: 'Doação de R$ 5', desc: 'Contribuição financeira essencial para o fundo emergencial de auxílio em Cuba.', icon: Heart },
    { value: 15, title: 'Doação de R$ 15', desc: 'Apoio financeiro direto para reforço de suporte e suprimentos básicos.', icon: Sparkles },
    { value: 30, title: 'Doação de R$ 30', desc: 'Contribuição financeira para o fundo humanitário e logística de emergência.', icon: Sparkles },
    { value: 50, title: 'Doação de R$ 50', desc: 'Aporte financeiro direto para o socorro de famílias em situação de vulnerabilidade.', icon: ShoppingBag },
    { value: 100, title: 'Doação de R$ 100', desc: 'Apoio financeiro de alto impacto para saúde, alimentação e insumos em Cuba.', icon: Pill },
    { value: 250, title: 'Doação de R$ 250', desc: 'Contribuição expressiva para sustentação das ações de ajuda comunitária.', icon: Heart },
    { value: 500, title: 'Doação de R$ 500', desc: 'Aporte financeiro corporativo / patrocinador para o fundo humanitário global.', icon: Zap },
  ];

  const currentImpact = impactOptions.find(opt => opt.value === selectedCalcValue) || impactOptions[0];

  return (
    <div className="min-h-screen cuba-decay-bg cuba-decay-texture text-slate-100 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-emerald-500/10">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Emergency Alert Tag */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Missão Humanitária 2026 • Apoio ao povo cubano em crise</span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-white drop-shadow-sm">
              Apoie o povo <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 font-black">
                cubano em crise.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Transforme solidariedade em esperança. Sua doação direta combate a escassez de alimentos e medicamentos, 
              entregando cestas de emergência e insumos vitais com total transparência e auditoria pública.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenDonateModalWithAmount(selectedCalcValue)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-base shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Heart className="w-5 h-5 fill-slate-900/40" />
                <span>Doe Agora em 1 Minuto</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onNavigateRegions && (
                <button
                  onClick={onNavigateRegions}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-bold text-base border border-emerald-500/50 backdrop-blur-md shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
                >
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Distribuição por Região</span>
                </button>
              )}
            </div>

            {/* Guarantees Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pix Instantâneo e Cartão</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Conformidade com LGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Criptografia 256-bit SSL</span>
              </div>
            </div>
          </div>

          {/* STATS TICKER CARD */}
          <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              <div className="p-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Arrecadado</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  R$ {stats.totalAmountRaised.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 100% repassado a ações
                </div>
              </div>

              <div className="p-2 pt-4 lg:pt-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doadores Engajados</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400">
                  {stats.totalDonors.toLocaleString('pt-BR')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Pessoas e famílias</div>
              </div>

              <div className="p-2 pt-4 lg:pt-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Famílias Socorridas</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {stats.familiesSupported.toLocaleString('pt-BR')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Em várias províncias</div>
              </div>

              <div className="p-2 pt-4 lg:pt-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Média por Doação</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400">
                  R$ {stats.averageDonation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Cada valor faz a diferença</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="mt-auto bg-slate-950 border-t border-emerald-500/20 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950">
                  <Heart className="w-5 h-5 fill-slate-950" />
                </div>
                <span className="text-lg font-bold text-white">doacaoCuba</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Plataforma independente de apoio humanitário ao povo cubano. 
                Transparência, eficiência e impacto direto na vida de quem mais precisa.
              </p>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold mb-4 uppercase text-[11px] tracking-wider">Navegação</h4>
              <ul className="space-y-2.5">
                <li><button onClick={onNavigateLogin} className="hover:text-emerald-400 transition-colors">Área do Doador / Login</button></li>
                <li><button onClick={onNavigateRegister} className="hover:text-emerald-400 transition-colors">Cadastrar-se / Criar Conta</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold mb-4 uppercase text-[11px] tracking-wider">Conformidade & LGPD</h4>
              <ul className="space-y-2.5">
                <li><span className="text-slate-400">Proteção de Dados (Lei 13.709/18)</span></li>
                <li><span className="text-slate-400">Certificado SSL 256-bit</span></li>
                <li><span className="text-slate-400">Processamento Seguro Pix/Cartão</span></li>
                <li><span className="text-slate-400">Emissão de Comprovante Digital</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold mb-4 uppercase text-[11px] tracking-wider">Acesso Rápido</h4>
              <div className="space-y-3">
                <button
                  onClick={onNavigateLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-medium text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Entrar / Área Restrita</span>
                </button>
                <button
                  onClick={onNavigateRegister}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium text-xs hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Cadastrar como Visitante</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <div>
              © 2026 doacaoCuba • Todos os direitos reservados.
            </div>
            <div className="text-center sm:text-right text-[11px]">
              Iniciativa civil de solidariedade ao povo de Cuba.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
