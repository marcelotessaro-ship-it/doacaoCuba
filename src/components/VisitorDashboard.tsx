import React, { useState } from 'react';
import { User, Donation } from '../types';
import { 
  UserCheck, 
  Heart, 
  Calendar, 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  PlusCircle, 
  Mail, 
  Phone, 
  Globe, 
  FileText,
  ShieldCheck,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface VisitorDashboardProps {
  currentUser: User;
  donations: Donation[];
  onOpenDonateModal: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

export const VisitorDashboard: React.FC<VisitorDashboardProps> = ({
  currentUser,
  donations,
  onOpenDonateModal,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cpf, setCpf] = useState(currentUser.cpf || '');
  const [street, setStreet] = useState(currentUser.street || '');
  const [number, setNumber] = useState(currentUser.number || '');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [stateUf, setStateUf] = useState(currentUser.stateUf || '');
  const [cep, setCep] = useState(currentUser.cep || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [country, setCountry] = useState(currentUser.country || 'Brasil');
  const [selectedReceipt, setSelectedReceipt] = useState<Donation | null>(null);

  React.useEffect(() => {
    setCpf(currentUser.cpf || '');
    setStreet(currentUser.street || '');
    setNumber(currentUser.number || '');
    setNeighborhood(currentUser.neighborhood || '');
    setCity(currentUser.city || '');
    setStateUf(currentUser.stateUf || '');
    setCep(currentUser.cep || '');
    setPhone(currentUser.phone || '');
    setCountry(currentUser.country || 'Brasil');
  }, [currentUser]);

  // Filter donations belonging to this visitor (or donor Email match)
  const myDonations = donations.filter(
    d => (d.donorId === currentUser.id) || (d.donorEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const totalDonated = myDonations.reduce((acc, d) => acc + d.amount, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAddress = (street || city)
      ? `${street.trim()}, ${number.trim()} - ${neighborhood.trim()}, ${city.trim()}/${stateUf.trim().toUpperCase()} - CEP ${cep.trim()}`
      : currentUser.address;

    onUpdateProfile({
      ...currentUser,
      cpf: cpf || currentUser.cpf,
      address: formattedAddress,
      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      stateUf: stateUf.trim().toUpperCase(),
      cep: cep.trim(),
      phone: phone || undefined,
      country: country || 'Brasil',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] cuba-decay-bg cuba-decay-texture p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP WELCOME BANNER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-bold text-xl">
                {currentUser.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Doador Ativo
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Membro desde {new Date(currentUser.createdAt).toLocaleDateString('pt-BR')} • {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={onOpenDonateModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Doação</span>
            </button>
          </div>
        </div>

        {/* SUMMARY METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/20">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Contribuído</div>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              R$ {totalDonated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% repassado a apoio direto
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-cyan-500/20">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Doações Realizadas</div>
            <div className="text-3xl font-black text-white">
              {myDonations.length} {myDonations.length === 1 ? 'Aporte' : 'Aportes'}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Última doação em {myDonations.length > 0 ? new Date(myDonations[0].createdAt).toLocaleDateString('pt-BR') : 'Nenhuma'}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-teal-500/20">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Seu Impacto Estimado</div>
            <div className="text-xl font-bold text-emerald-300">
              {myDonations.length > 0 ? 'Ajuda Direta a 3+ Famílias' : 'Aguardando primeira doação'}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Suas contribuições ajudaram com alimentos e saúde.
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLS: HISTÓRICO DE DOAÇÕES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Histórico de Doações</h2>
                  <p className="text-slate-400 text-xs">Registro de todas as contribuições realizadas por você.</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {myDonations.length} Registros
                </span>
              </div>

              {myDonations.length === 0 ? (
                <div className="text-center py-12 space-y-4 bg-slate-900/50 rounded-2xl border border-dashed border-white/10">
                  <Heart className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-slate-300 text-sm">Você ainda não realizou doações registradas neste perfil.</p>
                  <button
                    onClick={onOpenDonateModal}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                  >
                    Fazer Primeira Doação
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">{donation.id}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                            {donation.paymentMethod}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          R$ {donation.amount.toFixed(2)} • <span className="text-emerald-300 font-normal text-xs">{donation.impactLabel}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(donation.createdAt).toLocaleDateString('pt-BR')} às {new Date(donation.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                          {donation.status === 'concluido' ? 'Concluído' : donation.status}
                        </span>

                        <button
                          onClick={() => setSelectedReceipt(donation)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 text-xs font-medium transition-all flex items-center gap-1.5"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Comprovante</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: PERFIL DO VISITANTE */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Seu Perfil Cadastrado</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-semibold text-emerald-400 hover:underline"
                >
                  {isEditing ? 'Cancelar' : 'Editar Dados'}
                </button>
              </div>

              {!isEditing ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[11px]">Nome Completo</div>
                    <div className="text-white font-bold">{currentUser.name}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[11px]">CPF (Doador)</div>
                    <div className="text-emerald-300 font-mono font-bold">{currentUser.cpf || 'Não cadastrado'}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                    <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider text-emerald-400">Endereço Cadastrado</div>
                    <div className="grid grid-cols-2 gap-2 text-white text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Rua / Avenida:</span>
                        <span className="font-medium">{currentUser.street || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Número:</span>
                        <span className="font-medium">{currentUser.number || 'S/N'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Bairro:</span>
                        <span className="font-medium">{currentUser.neighborhood || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Cidade / UF:</span>
                        <span className="font-medium">{currentUser.city ? `${currentUser.city}/${currentUser.stateUf || ''}` : 'Não informado'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[10px]">CEP:</span>
                        <span className="font-medium font-mono">{currentUser.cep || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[11px]">E-mail de Cadastro</div>
                    <div className="text-white font-mono">{currentUser.email}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[11px]">Telefone / WhatsApp</div>
                    <div className="text-white">{currentUser.phone || 'Não informado'}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[11px]">País</div>
                    <div className="text-white">{currentUser.country || 'Brasil'}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">CPF *</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={e => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 rounded-xl glass-input text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2 pt-1 border-t border-white/10">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Endereço</div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-0.5 text-[10px]">CEP *</label>
                        <input
                          type="text"
                          value={cep}
                          onChange={e => setCep(e.target.value)}
                          placeholder="00000-000"
                          className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-xs"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-slate-400 mb-0.5 text-[10px]">Rua / Avenida *</label>
                        <input
                          type="text"
                          value={street}
                          onChange={e => setStreet(e.target.value)}
                          placeholder="Ex.: Av. Paulista"
                          className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-0.5 text-[10px]">Número *</label>
                        <input
                          type="text"
                          value={number}
                          onChange={e => setNumber(e.target.value)}
                          placeholder="1000"
                          className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-xs"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-slate-400 mb-0.5 text-[10px]">Bairro *</label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={e => setNeighborhood(e.target.value)}
                          placeholder="Ex.: Bela Vista"
                          className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-slate-400 mb-0.5 text-[10px]">Cidade *</label>
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="Ex.: São Paulo"
                          className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-0.5 text-[10px]">Estado (UF) *</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={stateUf}
                          onChange={e => setStateUf(e.target.value.toUpperCase())}
                          placeholder="SP"
                          className="w-full px-2.5 py-1.5 rounded-lg glass-input text-white text-xs uppercase"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">País</label>
                    <input
                      type="text"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                  >
                    Salvar Alterações
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dados protegidos pela LGPD (Lei 13.709/18).</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* COMPROVANTE MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 max-w-md w-full space-y-6 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Comprovante de Doação</h3>
              <p className="text-slate-400 text-xs">doacaoCuba • Apoio Humanitário</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs space-y-2 border border-white/10">
              <div className="flex justify-between text-slate-400">
                <span>Transação:</span>
                <span className="text-emerald-400 font-bold">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Doador:</span>
                <span className="text-white">{selectedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CPF:</span>
                <span className="text-slate-300">{selectedReceipt.donorCpf || '***.***.***-**'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Endereço:</span>
                <span className="text-slate-300 text-right max-w-[200px] truncate">{selectedReceipt.donorAddress || 'Registrado'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Valor:</span>
                <span className="text-emerald-400 font-bold">R$ {selectedReceipt.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Método:</span>
                <span className="text-cyan-300 uppercase">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Data:</span>
                <span className="text-white">{new Date(selectedReceipt.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Comprovante ${selectedReceipt.id} exportado em formato PDF!`);
                setSelectedReceipt(null);
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
