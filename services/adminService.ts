import { apiClient } from './apiClient';
import type { ApiEnvelope, DonationsListData, KpiSummary, VisitorsListData } from '../utils/types';

export interface DonationFilters {
  search?: string;
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
}

export const adminService = {
  async listVisitors(search?: string): Promise<VisitorsListData> {
    const { data } = await apiClient.get<ApiEnvelope<VisitorsListData>>('/admin/visitors', {
      params: { search },
    });
    return data.data;
  },

  async listDonations(filters: DonationFilters): Promise<DonationsListData> {
    const { data } = await apiClient.get<ApiEnvelope<DonationsListData>>('/admin/donations', {
      params: filters,
    });
    return data.data;
  },

  async getStats(): Promise<KpiSummary> {
    const { data } = await apiClient.get<ApiEnvelope<KpiSummary>>('/admin/stats');
    return data.data;
  },
};
