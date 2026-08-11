import { DONATION_AMOUNT_PRESETS } from '../../utils/constants';
import { formatCurrencyBRL } from '../../utils/formatters';

interface AmountPresetGridProps {
  selected: number | null;
  onSelect: (amount: number) => void;
}

export function AmountPresetGrid({ selected, onSelect }: AmountPresetGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {DONATION_AMOUNT_PRESETS.map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={() => onSelect(amount)}
          className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
            selected === amount
              ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 glow-emerald'
              : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/25'
          }`}
        >
          {formatCurrencyBRL(amount)}
        </button>
      ))}
    </div>
  );
}
