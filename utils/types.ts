export type UserRole = 'admin' | 'visitor';

export interface Address {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state_uf: string | null;
  cep: string | null;
  country?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  cpf: string | null;
  phone: string | null;
  address: Address;
  total_donated: number;
  created_at: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'crypto';
export type DonationStatus = 'pendente' | 'processando' | 'concluido';
export type DonationFrequency = 'unica' | 'mensal';

export interface Donation {
  id: number;
  donor_name: string;
  donor_email: string | null;
  donor_cpf: string | null;
  address: Address;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: DonationStatus;
  frequency: DonationFrequency;
  is_anonymous: boolean;
  transaction_hash: string;
  donor: User | null;
  created_at: string;
}

export interface KpiSummary {
  total_raised: number;
  donors_count: number;
  average_donation: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  errors: Record<string, string[]> | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface VisitorsListData {
  visitors: User[];
  meta: PaginationMeta;
}

export interface DonationsListData {
  donations: Donation[];
  meta: PaginationMeta;
}
