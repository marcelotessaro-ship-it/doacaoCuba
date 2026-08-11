import { DONATION_STATUS_META } from '../../utils/constants';
import type { DonationStatus } from '../../utils/types';

export function StatusBadge({ status }: { status: DonationStatus }) {
  const meta = DONATION_STATUS_META[status];

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${meta.className}`}>
      {meta.label}
    </span>
  );
}
