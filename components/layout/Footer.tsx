import { HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm text-slate-400 sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 font-bold text-slate-200">
          <HeartHandshake className="text-emerald-400" size={18} />
          doacao<span className="text-emerald-400">Cuba</span>
        </div>
        <p className="max-w-md">
          Plataforma independente de doações para apoiar o povo cubano diante da crise econômica.
          100% da transparência do que é arrecadado fica disponível para consulta.
        </p>
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} doacaoCuba. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
