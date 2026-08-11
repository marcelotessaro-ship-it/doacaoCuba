import { apiClient } from './apiClient';
import type { ApiEnvelope, User } from '../utils/types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state_uf?: string;
  cep?: string;
  password?: string;
  password_confirmation?: string;
}

export const profileService = {
  async get(): Promise<User> {
    const { data } = await apiClient.get<ApiEnvelope<{ user: User }>>('/profile');
    return data.data.user;
  },

  async update(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.put<ApiEnvelope<{ user: User }>>('/profile', payload);
    return data.data.user;
  },
};
