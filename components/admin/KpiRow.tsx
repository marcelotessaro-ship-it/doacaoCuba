import { CircleDollarSign, TrendingUp, Users } from 'lucide-react';
import { StatTile } from '../ui/StatTile';
import { formatCurrencyBRL } from '../../utils/formatters';
import type { KpiSummary } from '../../utils/types';

export function KpiRow({ stats, isLoading }: { stats: KpiSummary | null; isLoading: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatTile
        label="Total arrecadado"
        value={isLoading || !stats ? '—' : formatCurrencyBRL(stats.total_raised)}
        icon={<CircleDollarSign size={16} />}
        caption="doações concluídas"
        accent="emerald"
      />
      <StatTile
        label="Doadores"
        value={isLoading || !stats ? '—' : String(stats.donors_count)}
        icon={<Users size={16} />}
        caption="pessoas únicas"
        accent="blue"
      />
      <StatTile
        label="Doação média"
        value={isLoading || !stats ? '—' : formatCurrencyBRL(stats.average_donation)}
        icon={<TrendingUp size={16} />}
        caption="por doação"
        accent="cyan"
      />
    </div>
  );
}
