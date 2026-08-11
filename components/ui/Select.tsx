import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className = '', children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`glass-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  );
});
