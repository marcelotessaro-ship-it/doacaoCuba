import { useCallback, useEffect, useState } from 'react';
import { donationService } from '../services/donationService';
import { ApiError } from '../services/apiClient';
import type { Donation } from '../utils/types';

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await donationService.myHistory();
      setDonations(result.donations);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar suas doações.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { donations, isLoading, error, reload: load };
}
