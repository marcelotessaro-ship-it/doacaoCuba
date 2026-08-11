import { DataTable, type DataTableColumn } from '../ui/DataTable';
import { StatusBadge } from '../ui/StatusBadge';
import { PAYMENT_METHOD_META } from '../../utils/constants';
import { formatCurrencyBRL, formatDateTime } from '../../utils/formatters';
import type { Donation } from '../../utils/types';

export function DonationsTable({ donations, isLoading }: { donations: Donation[]; isLoading: boolean }) {
  const columns: DataTableColumn<Donation>[] = [
    { key: 'hash', header: 'Transação', render: (d) => <span className="font-mono text-xs text-cyan-300">{d.transaction_hash}</span> },
    { key: 'donor', header: 'Doador', render: (d) => d.donor_name },
    { key: 'amount', header: 'Valor', render: (d) => <span className="font-mono">{formatCurrencyBRL(d.amount)}</span> },
    { key: 'method', header: 'Pagamento', render: (d) => PAYMENT_METHOD_META[d.payment_method].label },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    { key: 'date', header: 'Data', render: (d) => formatDateTime(d.created_at) },
  ];

  return (
    <DataTable
      columns={columns}
      rows={donations}
      rowKey={(d) => d.id}
      isLoading={isLoading}
      emptyMessage="Nenhuma doação encontrada."
    />
  );
}
