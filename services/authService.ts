import { apiClient } from './apiClient';
import type { ApiEnvelope, User } from '../utils/types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  cpf?: string;
  phone?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state_uf?: string;
  cep?: string;
  country?: string;
  lgpd_consent: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await apiClient.post<ApiEnvelope<{ user: User }>>('/auth/register', payload);
    return data.data.user;
  },

  async login(payload: LoginPayload): Promise<{ user: User; token: string }> {
    const { data } = await apiClient.post<ApiEnvelope<{ user: User; token: string }>>('/auth/login', payload);
    return data.data;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<{ user: User }>>('/auth/me');
    return data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
