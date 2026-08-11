import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({ columns, rows, rowKey, emptyMessage = 'Nenhum registro encontrado.', isLoading = false }: DataTableProps<T>) {
  return (
    <div className="glass-panel overflow-x-auto rounded-3xl">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-400">
                Carregando...
              </td>
            </tr>
          )}
          {!isLoading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          )}
          {!isLoading &&
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3 text-slate-200 ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
