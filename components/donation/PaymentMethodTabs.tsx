import { CreditCard, QrCode, Receipt } from 'lucide-react';
import { PAYMENT_METHOD_META } from '../../utils/constants';
import type { PaymentMethod } from '../../utils/types';

interface PaymentMethodTabsProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const ICONS: Record<PaymentMethod, typeof QrCode> = {
  pix: QrCode,
  credit_card: CreditCard,
  boleto: Receipt,
};

export function PaymentMethodTabs({ selected, onSelect }: PaymentMethodTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.keys(PAYMENT_METHOD_META) as PaymentMethod[]).map((method) => {
        const Icon = ICONS[method];
        const meta = PAYMENT_METHOD_META[method];
        const isActive = selected === method;

        return (
          <button
            key={method}
            type="button"
            onClick={() => onSelect(method)}
            className={`flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left transition ${
              isActive
                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200 glow-cyan'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/25'
            }`}
          >
            <Icon size={20} />
            <span className="text-sm font-semibold">{meta.label}</span>
            <span className="text-xs text-slate-400">{meta.description}</span>
          </button>
        );
      })}
    </div>
  );
}
