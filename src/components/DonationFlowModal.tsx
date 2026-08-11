import React, { useState, useEffect } from 'react';
import { User, Donation, PaymentMethod, DonationFrequency } from '../types';
import { 
  X, 
  Heart, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Barcode, 
  Coins, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  PlusCircle
} from 'lucide-react';

interface DonationFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  initialAmount?: number;
  onDonationComplete: (newDonation: Donation) => void;
}

export const DonationFlowModal: React.FC<DonationFlowModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialAmount = 5,
  onDonationComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Valor/Identificação, 2: Pagamento, 3: Sucesso
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<DonationFrequency>('unica');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>(currentUser ? currentUser.name : '');
  const [donorEmail, setDonorEmail] = useState<string>(currentUser ? currentUser.email : '');
  const [donorCpf, setDonorCpf] = useState<string>(currentUser ? currentUser.cpf : '');
  
  // Endereço Desmembrado
  const [donorStreet, setDonorStreet] = useState<string>('');
  const [donorNumber, setDonorNumber] = useState<string>('');
  const [donorNeighborhood, setDonorNeighborhood] = useState<string>('');
  const [donorCity, setDonorCity] = useState<string>('');
  const [donorStateUf, setDonorStateUf] = useState<string>('');
  const [donorCep, setDonorCep] = useState<string>('');

  const [step1Error, setStep1Error] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState(currentUser ? currentUser.name.toUpperCase() : 'NOME NO CARTÃO');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('321');

  // Reset modal state to step 1 whenever opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCompletedDonation(null);
      setAmount(initialAmount || 5);
      setCustomAmount('');
      setIsProcessing(false);
      setCopiedCode(false);
      setStep1Error('');
      if (currentUser) {
        setDonorName(currentUser.name);
        setDonorEmail(currentUser.email);
        setDonorCpf(currentUser.cpf || '');
        setCardHolder(currentUser.name.toUpperCase());

        setDonorStreet(currentUser.street || '');
        setDonorNumber(currentUser.number || '');
        setDonorNeighborhood(currentUser.neighborhood || '');
        setDonorCity(currentUser.city || '');
        setDonorStateUf(currentUser.stateUf || '');
        setDonorCep(currentUser.cep || '');
      }
    }
  }, [isOpen, initialAmount, currentUser]);

  if (!isOpen) return null;

  const activeAmount = customAmount ? parseFloat(customAmount) || amount : amount;

  const computedAddress = (donorStreet || donorCity)
    ? `${donorStreet.trim()}, ${donorNumber.trim()} - ${donorNeighborhood.trim()}, ${donorCity.trim()}/${donorStateUf.trim().toUpperCase()} - CEP ${donorCep.trim()}`
    : 'Endereço não informado';

  const presetAmounts = [5, 15, 30, 50, 100, 250];

  const getImpactDescription = (val: number) => {
    if (val < 15) return 'Doação financeira direta para o fundo emergencial humanitário.';
    if (val < 30) return 'Contribuição financeira para o auxílio emergencial às famílias.';
    if (val < 50) return 'Auxílio financeiro para o fundo de apoio humanitário e socorro.';
    if (val < 100) return 'Contribuição financeira essencial para compra de itens vitais de emergência.';
    if (val < 250) return 'Doação financeira de alto impacto para o fundo de saúde e suporte em Cuba.';
    if (val < 500) return 'Aporte financeiro expressivo para manutenção e expansão da ajuda humanitária.';
    return 'Aporte financeiro corporativo / patrocinador para o fundo humanitário em Cuba.';
  };

  const handleCopyPix = () => {
    const pixCode = "00020126580014br.gov.bcb.pix0136doacaocuba-pix-chave-aleatoria-982192015204000053039865405100.005802BR5920DoacaoCubaHumanitaria6009SAO PAULO62070503***6304E8A2";
    navigator.clipboard.writeText(pixCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newDonation: Donation = {
        id: `DON-${Math.floor(10000 + Math.random() * 90000)}`,
        donorId: currentUser ? currentUser.id : undefined,
        donorName: isAnonymous ? 'Doador Anônimo' : (donorName.trim() || 'Doador Solidário'),
        donorCpf: donorCpf.trim() || '000.000.000-00',
        donorEmail: donorEmail.trim() || 'doador@exemplo.com',
        donorAddress: computedAddress || 'Endereço não informado',
        donorStreet: donorStreet.trim(),
        donorNumber: donorNumber.trim(),
        donorNeighborhood: donorNeighborhood.trim(),
        donorCity: donorCity.trim(),
        donorStateUf: donorStateUf.trim().toUpperCase(),
        donorCep: donorCep.trim(),
        amount: activeAmount,
        currency: 'BRL',
        paymentMethod: paymentMethod,
        status: 'concluido',
        frequency: frequency,
        createdAt: new Date().toISOString(),
        transactionHash: `${paymentMethod.toUpperCase()}-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        isAnonymous: isAnonymous,
        impactLabel: getImpactDescription(activeAmount),
      };

      setCompletedDonation(newDonation);
      setIsProcessing(false);
      setStep(3);
      onDonationComplete(newDonation);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Progress */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-emerald-400/30" />
            <span>Fluxo de Doação Segura</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {step === 1 && 'Escolha o Valor e Frequência'}
            {step === 2 && 'Forma de Pagamento'}
            {step === 3 && 'Doação Confirmada com Sucesso!'}
          </h2>

          {/* Step Indicator */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-emerald-400' : 'bg-slate-800'}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-emerald-400' : 'bg-slate-800'}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-emerald-400' : 'bg-slate-800'}`}></div>
          </div>
        </div>

        {/* STEP 1: VALOR E IDENTIFICAÇÃO */}
        {step === 1 && (
          <div className="space-y-6 pt-2">
            {/* Frequency selector */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-900/90 border border-white/10">
              <button
                type="button"
                onClick={() => setFrequency('unica')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  frequency === 'unica'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Doação Única
              </button>
              <button
                type="button"
                onClick={() => setFrequency('mensal')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  frequency === 'mensal'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apoio Mensal Recorrente</span>
              </button>
            </div>

            {/* Amount Presets */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Selecione o Valor da Contribuição (R$)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmount(val);
                      setCustomAmount('');
                    }}
                    className={`py-3.5 rounded-2xl font-black text-base transition-all border ${
                      amount === val && !customAmount
                        ? 'bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900/80 text-slate-200 border-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    R$ {val}
                  </button>
                ))}
              </div>

              {/* Custom amount field */}
              <div className="pt-1">
                <input
                  type="number"
                  placeholder="Ou insira outro valor exato (R$)..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Impact Note */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block text-white font-bold">Impacto da sua contribuição de R$ {activeAmount},00:</strong>
                <span>{getImpactDescription(activeAmount)}</span>
              </div>
            </div>

            {/* Donor Identification */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dados Obrigatórios do Doador</h4>
              
              {step1Error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {step1Error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    placeholder="Seu Nome Completo"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">CPF (Obrigatório) *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={donorCpf}
                    onChange={(e) => setDonorCpf(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Endereço Desmembrado */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider pt-1">
                  Endereço do Doador
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">CEP *</label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={donorCep}
                      onChange={(e) => setDonorCep(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Rua / Avenida *</label>
                    <input
                      type="text"
                      placeholder="Ex.: Av. Paulista"
                      value={donorStreet}
                      onChange={(e) => setDonorStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Número *</label>
                    <input
                      type="text"
                      placeholder="1000"
                      value={donorNumber}
                      onChange={(e) => setDonorNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Bairro *</label>
                    <input
                      type="text"
                      placeholder="Ex.: Bela Vista"
                      value={donorNeighborhood}
                      onChange={(e) => setDonorNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Cidade *</label>
                    <input
                      type="text"
                      placeholder="Ex.: São Paulo"
                      value={donorCity}
                      onChange={(e) => setDonorCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Estado (UF) *</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="SP"
                      value={donorStateUf}
                      onChange={(e) => setDonorStateUf(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500 uppercase"
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded bg-slate-800 border-white/20 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-300">Desejo manter meu nome oculto no relatório público (mantém registro interno para auditoria).</span>
              </label>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => {
                if (!donorName.trim() || !donorCpf.trim() || !donorEmail.trim() || !donorStreet.trim() || !donorCity.trim()) {
                  setStep1Error('Preencha os dados do doador: Nome, CPF, E-mail, Rua, Bairro, Cidade, Estado e CEP.');
                  return;
                }
                setStep1Error('');
                setStep(2);
              }}
              disabled={activeAmount <= 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Avançar para Pagamento (R$ {activeAmount},00)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: FORMA DE PAGAMENTO */}
        {step === 2 && (
          <div className="space-y-6 pt-2">
            {/* Payment Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'pix'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Pix Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'credit_card'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'boleto'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Barcode className="w-5 h-5 text-teal-400" />
                <span>Boleto Bancário</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'crypto'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Coins className="w-5 h-5 text-amber-400" />
                <span>Crypto (USDT)</span>
              </button>
            </div>

            {/* TAB CONTENT: PIX */}
            {paymentMethod === 'pix' && (
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-emerald-500/30 space-y-4 text-center">
                <div className="inline-block p-4 rounded-2xl bg-white text-slate-950 shadow-xl">
                  {/* Stylized QR code representation */}
                  <div className="w-36 h-36 border-4 border-slate-950 p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 bg-slate-950"></div>
                      <div className="w-8 h-8 bg-slate-950"></div>
                    </div>
                    <div className="flex justify-center items-center font-black text-xs tracking-widest text-emerald-700">
                      PIX CUBA
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 bg-slate-950"></div>
                      <div className="w-3 h-3 bg-slate-950"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-400">Chave Pix Copia e Cola:</div>
                  <div className="flex items-center gap-2 max-w-md mx-auto bg-slate-900 p-2.5 rounded-xl border border-white/10 text-xs font-mono text-emerald-300 overflow-hidden">
                    <span className="truncate">00020126580014br.gov.bcb.pix0136doacaocuba...</span>
                    <button
                      onClick={handleCopyPix}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all font-sans font-bold text-[11px] shrink-0 flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CREDIT CARD */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 text-white space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Cartão de Crédito</span>
                    <CreditCard className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-lg font-mono tracking-widest py-1">{cardNumber}</div>
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <span>{cardHolder}</span>
                    <span>EXP: {cardExpiry}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Número do Cartão"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Nome Impresso no Cartão"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Validade (MM/AA)"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: BOLETO */}
            {paymentMethod === 'boleto' && (
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/10 space-y-4 text-center">
                <Barcode className="w-16 h-16 text-teal-400 mx-auto" />
                <div className="text-xs text-slate-300">Linha Digitável do Boleto Humanitário:</div>
                <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-teal-300 border border-white/10 break-all">
                  23790.12830 90123.829102 1 92830000010000
                </div>
                <p className="text-[11px] text-slate-400">
                  O boleto pode levar até 1 dia útil para compensação bancária.
                </p>
              </div>
            )}

            {/* TAB CONTENT: CRYPTO */}
            {paymentMethod === 'crypto' && (
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-amber-500/30 space-y-4 text-center">
                <Coins className="w-12 h-12 text-amber-400 mx-auto" />
                <div className="text-xs text-slate-300">Carteira USDT TRC20 para doações em Crypto:</div>
                <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-amber-300 border border-amber-500/20 break-all">
                  TY912Aks9812MZa8901293810293810293
                </div>
              </div>
            )}

            {/* Back & Confirm Action */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Confirmando Transação...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Doação (R$ {activeAmount},00)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMAÇÃO E COMPROVANTE */}
        {step === 3 && completedDonation && (
          <div className="space-y-6 pt-2 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Muito Obrigado pela sua Generosidade!</h3>
              <p className="text-slate-300 text-xs max-w-md mx-auto">
                Sua doação foi recebida e já está destinada ao envio de insumos para as famílias em Cuba.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-950/90 p-6 rounded-2xl border border-emerald-500/30 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-white/10 font-sans">
                <span className="font-bold text-emerald-400">COMPROVANTE DE DOAÇÃO</span>
                <span className="text-slate-400">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Código do Pedido:</span>
                <span className="text-white font-bold">{completedDonation.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Doador:</span>
                <span className="text-white">{completedDonation.donorName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Valor do Aporte:</span>
                <span className="text-emerald-400 font-bold text-sm">R$ {completedDonation.amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Forma de Pagamento:</span>
                <span className="text-cyan-300 uppercase">{completedDonation.paymentMethod}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/10 font-sans text-[11px]">
                <span className="text-slate-400">Destinação de Impacto:</span>
                <span className="text-emerald-300 font-semibold">{completedDonation.impactLabel}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Comprovante Digital ${completedDonation.id} gerado com sucesso!`);
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Comprovante PDF</span>
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setCompletedDonation(null);
                  setAmount(initialAmount || 5);
                  setCustomAmount('');
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nova Doação</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white underline pt-2 transition-colors block mx-auto"
            >
              Concluir e Voltar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
