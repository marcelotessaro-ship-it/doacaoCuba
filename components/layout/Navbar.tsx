import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, LayoutDashboard, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 sm:px-8">
      <nav className="glass-panel-light mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-black tracking-tight text-slate-50">
          <HeartHandshake className="text-emerald-400" size={22} />
          <span className="text-lg">doacao<span className="text-emerald-400">Cuba</span></span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="secondary" size="sm">
                <ShieldCheck size={16} />
                <span className="hidden sm:inline">Painel Admin</span>
              </Button>
            </Link>
          )}

          {user && !isAdmin && (
            <Link to="/painel">
              <Button variant="secondary" size="sm">
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Meu painel</span>
              </Button>
            </Link>
          )}

          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">
                <UserIcon size={16} />
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
