import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { PAYMENT_METHOD_META } from '../../utils/constants';
import { formatCurrencyBRL, formatDateTime } from '../../utils/formatters';
import type { Donation } from '../../utils/types';

export function DonationReceipt({ donation }: { donation: Donation }) {
  const isConcluded = donation.status === 'concluido';
  const isCancelled = donation.status === 'cancelado';
  const isPending = !isConcluded && !isCancelled;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          isConcluded
            ? 'bg-emerald-500/15 text-emerald-400'
            : isCancelled
              ? 'bg-rose-500/15 text-rose-400'
              : 'bg-amber-500/15 text-amber-400'
        }`}
      >
        {isConcluded ? <CheckCircle2 size={32} /> : isCancelled ? <XCircle size={32} /> : <Clock size={32} />}
      </span>
      <div>
        <h3 className="text-xl font-black text-slate-50">
          {isConcluded ? 'Doação confirmada!' : isCancelled ? 'Cobrança cancelada' : 'Falta pouco! Conclua o pagamento'}
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          {isConcluded
            ? `Muito obrigado, ${donation.donor_name}. Seu apoio faz a diferença.`
            : isCancelled
              ? 'Essa cobrança foi cancelada ou estornada. Caso queira doar novamente, inicie um novo pagamento.'
              : 'Assim que o pagamento for compensado, sua doação será confirmada automaticamente.'}
        </p>
      </div>

      {isPending && donation.payment_method === 'pix' && donation.pix_qr_code && (
        <div className="flex w-full flex-col items-center gap-3">
          <img
            src={`data:image/png;base64,${donation.pix_qr_code}`}
            alt="QR Code Pix para pagamento"
            className="h-48 w-48 rounded-2xl border border-white/10 bg-white p-2"
          />
          {donation.pix_copy_paste && (
            <div className="glass-panel-light w-full rounded-2xl p-3 text-left">
              <p className="mb-1 text-xs uppercase tracking-widest text-slate-400">Pix copia e cola</p>
              <p className="break-all font-mono text-xs text-cyan-300">{donation.pix_copy_paste}</p>
            </div>
          )}
        </div>
      )}

      {isPending && donation.payment_method === 'boleto' && (donation.boleto_url || donation.invoice_url) && (
        <a
          href={donation.boleto_url ?? donation.invoice_url ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="glow-cyan w-full rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200"
        >
          Abrir boleto para pagamento
        </a>
      )}

      {isPending && donation.payment_method === 'credit_card' && donation.invoice_url && (
        <a
          href={donation.invoice_url}
          target="_blank"
          rel="noreferrer"
          className="glow-cyan w-full rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200"
        >
          Pagar com cartão de crédito
        </a>
      )}

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
