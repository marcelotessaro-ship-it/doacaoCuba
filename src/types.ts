export type UserRole = 'admin' | 'visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf: string;
  address: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  stateUf?: string;
  cep?: string;
  phone?: string;
  country?: string;
  createdAt: string;
  totalDonated: number;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'crypto';
export type DonationStatus = 'concluido' | 'pendente' | 'processando';
export type DonationFrequency = 'unica' | 'mensal';

export interface Donation {
  id: string;
  donorId?: string;
  donorName: string;
  donorCpf: string;
  donorEmail: string;
  donorAddress: string;
  donorStreet?: string;
  donorNumber?: string;
  donorNeighborhood?: string;
  donorCity?: string;
  donorStateUf?: string;
  donorCep?: string;
  amount: number;
  currency: 'BRL';
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  frequency: DonationFrequency;
  createdAt: string;
  transactionHash: string;
  isAnonymous?: boolean;
  impactLabel?: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  amountSpent: number;
  familiesBenefited: number;
  category: 'alimentos' | 'medicamentos' | 'energia' | 'apoio_direto';
  status: 'entregue' | 'em_transito';
  imageUrl?: string;
}

export interface SystemStats {
  totalAmountRaised: number;
  totalDonors: number;
  averageDonation: number;
  familiesSupported: number;
}
