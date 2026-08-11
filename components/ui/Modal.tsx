import { useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useModalClose } from '../../hooks/useModalClose';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidthClassName?: string;
}

export function Modal({ isOpen, onClose, children, title, maxWidthClassName = 'max-w-lg' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useModalClose(panelRef, isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div ref={panelRef} className={`glass-panel relative w-full ${maxWidthClassName} rounded-3xl p-6 sm:p-8`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-100"
        >
          <X size={18} />
        </button>
        {title && <h2 className="mb-6 pr-8 text-xl font-bold text-slate-50">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
