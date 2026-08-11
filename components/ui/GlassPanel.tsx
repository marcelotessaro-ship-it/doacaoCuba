import type { HTMLAttributes, ReactNode } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  light?: boolean;
}

export function GlassPanel({ children, light = false, className = '', ...rest }: GlassPanelProps) {
  return (
    <div className={`${light ? 'glass-panel-light' : 'glass-panel'} rounded-3xl ${className}`} {...rest}>
      {children}
    </div>
  );
}
