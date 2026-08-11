import type { ReactNode } from 'react';

export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="cuba-decay-bg cuba-decay-texture relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
