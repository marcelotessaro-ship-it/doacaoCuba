import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: string;
  icon?: ReactNode;
  caption?: string;
  accent?: 'emerald' | 'blue' | 'cyan' | 'amber';
}

const ACCENT_CLASSES: Record<NonNullable<StatTileProps['accent']>, string> = {
  emerald: 'border-emerald-500/25 text-emerald-400',
  blue: 'border-blue-500/25 text-blue-400',
  cyan: 'border-cyan-500/25 text-cyan-400',
  amber: 'border-amber-500/25 text-amber-400',
};

export function StatTile({ label, value, icon, caption, accent = 'emerald' }: StatTileProps) {
  return (
    <div className={`glass-card rounded-3xl p-6 border ${ACCENT_CLASSES[accent]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-50">{value}</p>
      {(icon || caption) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          {icon}
          {caption && <span>{caption}</span>}
        </div>
      )}
    </div>
  );
}
