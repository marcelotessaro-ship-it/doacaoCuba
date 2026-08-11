import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { PageBackground } from '../components/layout/PageBackground';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoginShortcutsCard } from '../components/auth/LoginShortcutsCard';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ApiError } from '../services/apiClient';

export function LoginPage() {
  const { login, user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('sessao_expirada')) {
      showToast('Sua sessão expirou. Faça login novamente.', 'info');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin' : '/painel', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const loggedUser = await login({ email, password });
      showToast('Login realizado com sucesso.', 'success');
      navigate(loggedUser.role === 'admin' ? '/admin' : '/painel', { replace: true });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Não foi possível fazer login.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageBackground>
      <Navbar />

      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pb-16 pt-32 sm:px-0">
        <GlassCard className="p-8">
          <h1 className="text-2xl font-black text-slate-50">Entrar</h1>
          <p className="mt-1 text-sm text-slate-400">Acesse sua conta para acompanhar suas doações.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              required
            />
            <Input
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
            />
            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
              <LogIn size={18} />
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Ainda não tem uma conta?{' '}
            <Link to="/registrar" className="font-semibold text-emerald-400 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </GlassCard>

        <div className="mt-4">
          <LoginShortcutsCard onSelect={(demoEmail, demoPassword) => { setEmail(demoEmail); setPassword(demoPassword); }} />
        </div>
      </main>
    </PageBackground>
  );
}
