import type { DonationStatus, PaymentMethod } from './types';

export const DONATION_AMOUNT_PRESETS = [25, 50, 100, 250, 500] as const;

export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string; description: string }> = {
  pix: { label: 'Pix', description: 'Transferência instantânea' },
  credit_card: { label: 'Cartão de crédito', description: 'Débito na fatura' },
  boleto: { label: 'Boleto', description: 'Vencimento em até 3 dias úteis' },
};

export const DONATION_STATUS_META: Record<DonationStatus, { label: string; className: string }> = {
  concluido: { label: 'Concluído', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  processando: { label: 'Processando', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  pendente: { label: 'Pendente', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  cancelado: { label: 'Cancelado', className: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
};

export const BRAZILIAN_STATES = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
] as const;

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@admin.com', password: '123456' },
  visitor: { email: 'visitante@doacaocuba.org', password: '123456' },
} as const;
