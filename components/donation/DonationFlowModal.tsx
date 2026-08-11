import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AmountPresetGrid } from './AmountPresetGrid';
import { PaymentMethodTabs } from './PaymentMethodTabs';
import { DonationReceipt } from './DonationReceipt';
import { donationService } from '../../services/donationService';
import { ApiError } from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatCurrencyBRL } from '../../utils/formatters';
import type { Donation, PaymentMethod } from '../../utils/types';

interface DonationFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

export function DonationFlowModal({ isOpen, onClose }: DonationFlowModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorCpf, setDonorCpf] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donation, setDonation] = useState<Donation | null>(null);

  const needsCpf = !user?.cpf;

  // Consulta a Asaas a cada 5s enquanto o pagamento está pendente: em localhost o
  // webhook não é alcançável, então essa é a única forma de detectar a confirmação.
  useEffect(() => {
    if (step !== 3 || !donation) return;
    if (donation.status === 'concluido' || donation.status === 'cancelado') return;

    const intervalId = window.setInterval(async () => {
      try {
        const updated = await donationService.checkStatus(donation.transaction_hash);
        setDonation(updated);
      } catch {
        // Falha silenciosa: mantém o status atual e tenta novamente no próximo ciclo.
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [step, donation]);

  function reset() {
    setStep(1);
    setAmount(null);
    setCustomAmount('');
    setPaymentMethod(null);
    setDonorName('');
    setDonorEmail('');
    setDonorCpf('');
    setDonation(null);
  }

  function handleClose() {
    onClose();
    window.setTimeout(reset, 300);
  }

  function handleCustomAmountChange(value: string) {
    setCustomAmount(value);
    const parsed = Number(value.replace(',', '.'));
    setAmount(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
  }

  async function handleConfirm() {
    if (!amount || !paymentMethod) return;
    if (!user && (!donorName || !donorEmail)) {
      showToast('Informe seu nome e e-mail para continuar.', 'error');
      return;
    }
    if (needsCpf && !donorCpf) {
      showToast('Informe seu CPF para gerar a cobrança.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await donationService.create({
        amount,
        payment_method: paymentMethod,
        donor_name: user ? undefined : donorName,
        donor_email: user ? undefined : donorEmail,
        donor_cpf: needsCpf ? donorCpf : undefined,
      });
      setDonation(created);
      setStep(3);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Não foi possível registrar sua doação.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const stepLabels = ['Valor', 'Pagamento', 'Confirmação'];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={step < 3 ? 'Fazer uma doação' : undefined} maxWidthClassName="max-w-md">
      {step < 3 && (
        <div className="mb-6 flex gap-2">
          {stepLabels.map((label, index) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${index + 1 <= step ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-white/10'}`} />
              <span className="mt-1 block text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-3 text-sm text-slate-300">Escolha um valor sugerido ou informe o valor livre.</p>
            <AmountPresetGrid selected={amount} onSelect={(value) => { setAmount(value); setCustomAmount(''); }} />
          </div>
          <Input
            label="Ou digite outro valor (R$)"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            name="custom_amount"
          />
          <Button variant="primary" size="lg" disabled={!amount} onClick={() => setStep(2)}>
            Continuar
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <PaymentMethodTabs selected={paymentMethod} onSelect={setPaymentMethod} />

          {(!user || needsCpf) && (
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Seus dados</p>
              {!user && (
                <>
                  <Input label="Nome completo" value={donorName} onChange={(e) => setDonorName(e.target.value)} name="donor_name" required />
                  <Input label="E-mail" type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} name="donor_email" required />
                </>
              )}
              {needsCpf && (
                <Input
                  label="CPF"
                  value={donorCpf}
                  onChange={(e) => setDonorCpf(e.target.value)}
                  name="donor_cpf"
                  placeholder="000.000.000-00"
                  required
                />
              )}
            </div>
          )}

          <div className="glass-panel-light rounded-2xl p-4 text-sm">
            <span className="text-slate-400">Valor selecionado: </span>
            <span className="font-semibold text-emerald-300">{amount ? formatCurrencyBRL(amount) : '—'}</span>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1">
              Voltar
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!paymentMethod || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar doação'}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && donation && (
        <div className="flex flex-col gap-6">
          <DonationReceipt donation={donation} />
          <Button variant="primary" size="lg" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      )}
    </Modal>
  );
}
