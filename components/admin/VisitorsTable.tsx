import { DataTable, type DataTableColumn } from '../ui/DataTable';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import type { User } from '../../utils/types';

export function VisitorsTable({ visitors, isLoading }: { visitors: User[]; isLoading: boolean }) {
  const columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'Nome', render: (v) => v.name },
    { key: 'email', header: 'E-mail', render: (v) => v.email },
    { key: 'total', header: 'Total doado', render: (v) => <span className="font-mono">{formatCurrencyBRL(v.total_donated)}</span> },
    { key: 'created', header: 'Cadastro', render: (v) => formatDate(v.created_at) },
  ];

  return (
    <DataTable
      columns={columns}
      rows={visitors}
      rowKey={(v) => v.id}
      isLoading={isLoading}
      emptyMessage="Nenhum visitante encontrado."
    />
  );
}
