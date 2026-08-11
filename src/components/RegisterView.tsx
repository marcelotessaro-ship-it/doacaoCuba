import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Mail, Lock, Phone, ShieldCheck, ArrowRight, Globe, Shield, UserCheck, FileText, MapPin } from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: (newUser: User) => void;
  onNavigateLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  // Endereço desmembrado
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [role, setRole] = useState<UserRole>('visitor');
  const [lgpdAccepted, setLgpdAccepted] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password || !cpf || !cep || !street || !number || !neighborhood || !city || !stateUf) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*), incluindo Rua, Número, Bairro, Cidade, Estado e CEP.');
      return;
    }

    if (!lgpdAccepted) {
      setErrorMsg('Você precisa concordar com os termos de privacidade para continuar.');
      return;
    }

    const fullAddress = `${street.trim()}, ${number.trim()} - ${neighborhood.trim()}, ${city.trim()}/${stateUf.trim().toUpperCase()} - CEP ${cep.trim()}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role,
      cpf: cpf.trim(),
      address: fullAddress,
      street: street.trim(),
      number: number.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      stateUf: stateUf.trim().toUpperCase(),
      cep: cep.trim(),
      phone: phone || undefined,
      country: country || 'Brasil',
      createdAt: new Date().toISOString(),
      totalDonated: 0,
    };

    onRegisterSuccess(newUser);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] cuba-decay-bg cuba-decay-texture flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">Criar Nova Conta</h2>
            <p className="text-slate-400 text-xs">
              Cadastre-se como visitante doador ou gestor administrador do sistema.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* TIPO DE CONTA / FUNÇÃO */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Conta *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('visitor')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    role === 'visitor'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className={`w-4 h-4 ${role === 'visitor' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs">Visitante / Doador</div>
                    <div className="text-[10px] text-slate-400 font-normal">Acompanhar doações</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    role === 'admin'
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className={`w-4 h-4 ${role === 'admin' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs">Administrador</div>
                    <div className="text-[10px] text-slate-400 font-normal">Gestão e relatórios</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex.: Maria Clara Fernandes"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                required
              />
            </div>

            {/* CPF e ENDEREÇO COMPLETO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  CPF (Obrigatório) *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ENDEREÇO DESMEMBRADO */}
            <div className="space-y-3 pt-1 border-t border-white/10">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Endereço do Doador</span>
              </div>

              {/* CEP + Rua */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CEP *
                  </label>
                  <input
                    type="text"
                    value={cep}
                    onChange={e => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rua / Avenida *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Ex.: Av. Paulista"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Número + Bairro */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    placeholder="1000, Apt 42"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    placeholder="Ex.: Bela Vista"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Cidade + Estado (UF) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Ex.: São Paulo"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estado (UF) *
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={stateUf}
                    onChange={e => setStateUf(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 uppercase"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telefone / WhatsApp (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  País
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="Brasil"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* AVISO DE CONFORMIDADE COM A LGPD (Exigido no prompt) */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Termos de Uso e Proteção de Dados (LGPD)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), 
                seus dados pessoais serão armazenados de forma segura e utilizados estritamente para a emissão dos comprovantes de doação e prestação de contas. Não compartilhamos informações com terceiros.
              </p>
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lgpdAccepted}
                  onChange={e => setLgpdAccepted(e.target.checked)}
                  className="rounded bg-slate-800 border-white/20 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-200">Li e concordo com o tratamento dos dados pessoais.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <span>Concluir Cadastro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Já possui um cadastro?{' '}
              <button
                onClick={onNavigateLogin}
                className="text-emerald-400 font-bold hover:underline"
              >
                Voltar ao Login
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
