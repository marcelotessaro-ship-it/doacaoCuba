import { apiClient } from './apiClient';
import type { ApiEnvelope, Donation, DonationsListData, PaymentMethod } from '../utils/types';

export interface CreateDonationPayload {
  amount: number;
  payment_method: PaymentMethod;
  frequency?: 'unica' | 'mensal';
  is_anonymous?: boolean;
  donor_name?: string;
  donor_email?: string;
  donor_cpf?: string;
  donor_street?: string;
  donor_number?: string;
  donor_neighborhood?: string;
  donor_city?: string;
  donor_state_uf?: string;
  donor_cep?: string;
}

export const donationService = {
  async create(payload: CreateDonationPayload): Promise<Donation> {
    const { data } = await apiClient.post<ApiEnvelope<{ donation: Donation }>>('/donations', payload);
    return data.data.donation;
  },

  async myHistory(): Promise<DonationsListData> {
    const { data } = await apiClient.get<ApiEnvelope<DonationsListData>>('/donations/me');
    return data.data;
  },

  async checkStatus(transactionHash: string): Promise<Donation> {
    const { data } = await apiClient.get<ApiEnvelope<{ donation: Donation }>>(
      `/donations/${transactionHash}/status`,
    );
    return data.data.donation;
  },
};
