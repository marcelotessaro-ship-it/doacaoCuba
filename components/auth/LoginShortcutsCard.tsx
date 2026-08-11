import { ShieldCheck, UserRound } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { DEMO_CREDENTIALS } from '../../utils/constants';

interface LoginShortcutsCardProps {
  onSelect: (email: string, password: string) => void;
}

export function LoginShortcutsCard({ onSelect }: LoginShortcutsCardProps) {
  return (
    <GlassPanel light className="p-5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Acesso de demonstração
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect(DEMO_CREDENTIALS.admin.email, DEMO_CREDENTIALS.admin.password)}
          className="glass-card-hover flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-white/5 px-4 py-3 text-left transition"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <ShieldCheck size={18} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-100">Entrar como Administrador</span>
            <span className="block text-xs text-slate-400">{DEMO_CREDENTIALS.admin.email}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect(DEMO_CREDENTIALS.visitor.email, DEMO_CREDENTIALS.visitor.password)}
          className="glass-card-hover flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-white/5 px-4 py-3 text-left transition"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <UserRound size={18} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-100">Entrar como Visitante</span>
            <span className="block text-xs text-slate-400">{DEMO_CREDENTIALS.visitor.email}</span>
          </span>
        </button>
      </div>
    </GlassPanel>
  );
}
