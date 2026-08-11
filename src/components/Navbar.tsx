import React from 'react';
import { User } from '../types';
import { Heart, ShieldCheck, UserCheck, LogOut, Lock, UserPlus } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeView: 'landing' | 'login' | 'register' | 'visitor_dashboard' | 'admin_dashboard' | 'cuba_regions';
  setActiveView: (view: 'landing' | 'login' | 'register' | 'visitor_dashboard' | 'admin_dashboard' | 'cuba_regions') => void;
  onOpenDonateModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onOpenDonateModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-20 border-b border-white/10 backdrop-blur-md bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveView('landing')} 
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-semibold tracking-tight text-white">doacao</span>
              <span className="text-2xl font-bold text-emerald-400">
                Cuba
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-medium block -mt-1">
              Apoio Humanitário
            </span>
          </div>
        </button>




        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Donate Button */}
          <button
            onClick={onOpenDonateModal}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-slate-900/40" />
            <span>Doe Agora</span>
          </button>

          {/* User Auth Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => setActiveView('admin_dashboard')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-lg flex items-center gap-1.5 transition-all ${
                    activeView === 'admin_dashboard'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-white/10 border border-white/20 text-amber-300 hover:bg-white/20'
                  }`}
                  title="Painel de Administração"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveView('visitor_dashboard')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-lg flex items-center gap-1.5 transition-all ${
                    activeView === 'visitor_dashboard'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/10 border border-white/20 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Meu Painel</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-2.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-all"
                title="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login button */}
              <button
                onClick={() => setActiveView('login')}
                className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-sm font-semibold backdrop-blur-lg text-slate-100 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entrar</span>
              </button>

              <button
                onClick={() => setActiveView('register')}
                className="px-5 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-semibold border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Cadastrar Usuário</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
