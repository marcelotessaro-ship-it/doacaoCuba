import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, KeyRound, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateRegister: () => void;
  allUsers: User[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  allUsers,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [autofillSuccessMsg, setAutofillSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    // Default demo password rule: 123456 (or match existing demo user)
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (foundUser && (password === '123456' || password.length >= 6)) {
      onLoginSuccess(foundUser);
    } else {
      setErrorMsg('E-mail ou senha inválidos. Para usuários de demonstração, utilize a senha: 123456');
    }
  };

  const autofillUser = (role: 'admin' | 'visitor') => {
    setErrorMsg('');
    if (role === 'admin') {
      const admin = allUsers.find(u => u.role === 'admin') || {
        id: 'user-admin',
        name: 'Administrador doacaoCuba',
        email: 'admin@doacaocuba.org',
        role: 'admin',
        createdAt: new Date().toISOString(),
        totalDonated: 0,
      };
      setEmail(admin.email);
      setPassword('123456');
      setAutofillSuccessMsg('Dados do Administrador preenchidos!');
      setTimeout(() => {
        onLoginSuccess(admin);
      }, 300);
    } else {
      const visitor = allUsers.find(u => u.role === 'visitor') || {
        id: 'user-visitor-1',
        name: 'Carlos Eduardo Silva',
        email: 'visitante@exemplo.com',
        role: 'visitor',
        createdAt: new Date().toISOString(),
        totalDonated: 350,
      };
      setEmail(visitor.email);
      setPassword('123456');
      setAutofillSuccessMsg('Dados de Visitante Doador preenchidos!');
      setTimeout(() => {
        onLoginSuccess(visitor);
      }, 300);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] cuba-decay-bg cuba-decay-texture flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        
        {/* MAIN LOGIN CARD */}
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">Acesse sua Conta</h2>
            <p className="text-slate-400 text-xs">
              Entre para visualizar seu histórico de doações ou gerenciar o sistema.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {autofillSuccessMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{autofillSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail de Acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Ainda não tem uma conta?{' '}
              <button
                onClick={onNavigateRegister}
                className="text-emerald-400 font-bold hover:underline"
              >
                Cadastre-se como Visitante
              </button>
            </p>
          </div>
        </div>

        {/* CARD DE ATALHOS DE LOGIN (Exigido nas regras do prompt) */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Atalhos de Demonstração (Autopreenchimento)</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Clique em uma das opções abaixo para preencher automaticamente as credenciais de teste (Senha padrão: <strong className="text-white">123456</strong>):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => autofillUser('admin')}
              className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Admin
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Entrar como Administrador
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  admin@doacaocuba.org
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => autofillUser('visitor')}
              className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Visitante
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Entrar como Visitante
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  visitante@exemplo.com
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
