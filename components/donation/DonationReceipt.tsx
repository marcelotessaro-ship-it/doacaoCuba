import { CheckCircle2 } from 'lucide-react';
import { PAYMENT_METHOD_META } from '../../utils/constants';
import { formatCurrencyBRL, formatDateTime } from '../../utils/formatters';
import type { Donation } from '../../utils/types';

export function DonationReceipt({ donation }: { donation: Donation }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 size={32} />
      </span>
      <div>
        <h3 className="text-xl font-black text-slate-50">Doação confirmada!</h3>
        <p className="mt-1 text-sm text-slate-400">
          Muito obrigado, {donation.donor_name}. Seu apoio faz a diferença.
        </p>
      </div>

      <div className="glass-panel-light w-full rounded-2xl p-5 text-left font-mono text-sm">
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between">
            <dt className="text-slate-400">Valor</dt>
            <dd className="font-semibold text-emerald-300">{formatCurrencyBRL(donation.amount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Forma de pagamento</dt>
            <dd>{PAYMENT_METHOD_META[donation.payment_method].label}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Data</dt>
            <dd>{formatDateTime(donation.created_at)}</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2">
            <dt className="text-slate-400">Código da transação</dt>
            <dd className="text-cyan-300">{donation.transaction_hash}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
