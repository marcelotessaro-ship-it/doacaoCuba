import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { PageBackground } from '../components/layout/PageBackground';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ApiError } from '../services/apiClient';
import { BRAZILIAN_STATES } from '../utils/constants';
import { maskCEP, maskCPF } from '../utils/formatters';

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [cpf, setCpf] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');
  const [cep, setCep] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!lgpdConsent) {
      showToast('É necessário aceitar os termos de uso dos seus dados (LGPD) para continuar.', 'error');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        cpf: cpf || undefined,
        street: street || undefined,
        number: number || undefined,
        neighborhood: neighborhood || undefined,
        city: city || undefined,
        state_uf: stateUf || undefined,
        cep: cep || undefined,
        country: country || undefined,
        lgpd_consent: lgpdConsent,
      });
      showToast('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
      navigate('/login', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        showToast('Não foi possível concluir o cadastro.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageBackground>
      <Navbar />

      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-32 sm:px-0">
        <GlassCard className="p-8">
          <h1 className="text-2xl font-black text-slate-50">Criar conta</h1>
          <p className="mt-1 text-sm text-slate-400">Cadastre-se para acompanhar seu histórico de doações.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              label="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name?.[0]}
              name="name"
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email?.[0]}
                name="email"
                required
              />
              <Input
                label="CPF"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(maskCPF(e.target.value))}
                error={fieldErrors.cpf?.[0]}
                name="cpf"
                maxLength={14}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Senha"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password?.[0]}
                name="password"
                required
              />
              <Input
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                name="password_confirmation"
                required
              />
            </div>

            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Endereço</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
              <Input
                label="Rua"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                error={fieldErrors.street?.[0]}
                name="street"
              />
              <Input
                label="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                error={fieldErrors.number?.[0]}
                name="number"
                className="sm:w-28"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Bairro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                error={fieldErrors.neighborhood?.[0]}
                name="neighborhood"
              />
              <Input
                label="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={fieldErrors.city?.[0]}
                name="city"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select
                label="Estado"
                value={stateUf}
                onChange={(e) => setStateUf(e.target.value)}
                error={fieldErrors.state_uf?.[0]}
                name="state_uf"
              >
                <option value="">Selecione</option>
                {BRAZILIAN_STATES.map((state) => (
                  <option key={state.uf} value={state.uf}>
                    {state.name}
                  </option>
                ))}
              </Select>
              <Input
                label="CEP"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(maskCEP(e.target.value))}
                error={fieldErrors.cep?.[0]}
                name="cep"
                maxLength={9}
              />
              <Input
                label="País"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                error={fieldErrors.country?.[0]}
                name="country"
              />
            </div>

            {/* RF-13 — LGPD consent notice */}
            <label className="glass-panel-light flex cursor-pointer items-start gap-3 rounded-2xl p-4 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-emerald-500"
                required
              />
              <span>
                Autorizo o uso dos meus dados pessoais (nome, e-mail e histórico de doações) exclusivamente
                para fins de identificação e acompanhamento das minhas doações, conforme a Lei Geral de
                Proteção de Dados (LGPD). Você pode solicitar a visualização, correção ou exclusão dos seus
                dados a qualquer momento no seu painel.
              </span>
            </label>

            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
              <UserPlus size={18} />
              {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
              Fazer login
            </Link>
          </p>
        </GlassCard>
      </main>
    </PageBackground>
  );
}
