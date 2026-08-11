import { Link } from 'react-router-dom';
import { PageBackground } from '../components/layout/PageBackground';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <PageBackground>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-7xl font-black text-emerald-400">404</p>
        <h1 className="text-xl font-bold text-slate-100">Página não encontrada</h1>
        <p className="max-w-sm text-sm text-slate-400">
          A página que você tentou acessar não existe ou foi movida.
        </p>
        <Link to="/">
          <Button>Voltar para o início</Button>
        </Link>
      </main>
    </PageBackground>
  );
}
