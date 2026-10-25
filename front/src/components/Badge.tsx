import type { ReactNode } from 'react';
import dotEsmeralda from '../assets/ui/dot-esmeralda.svg';
import dotAviso from '../assets/ui/dot-aviso.svg';

export type BadgeTipo = 'descuento' | 'oferta' | 'nuevo' | 'categoria' | 'en-stock' | 'pocas-unidades' | 'agotado';

const STYLES: Record<BadgeTipo, string> = {
  descuento: 'bg-bosque text-lima px-2.5 py-[5px] text-label-sm font-semibold',
  oferta: 'bg-lima text-bosque px-2.5 py-[5px] text-label-sm font-semibold',
  nuevo: 'bg-menta text-esmeralda-oscuro px-2.5 py-[5px] text-label-sm font-semibold',
  categoria: 'bg-menta text-esmeralda-oscuro gap-1.5 px-2.5 py-[5px] text-overline font-bold uppercase',
  'en-stock': 'text-esmeralda-oscuro gap-1.5 py-0.5 text-label-sm font-semibold',
  'pocas-unidades': 'text-bosque gap-1.5 py-0.5 text-label-sm font-semibold',
  agotado: 'bg-error-suave text-error px-2.5 py-[5px] text-label-sm font-semibold',
};

const DOTS: Partial<Record<BadgeTipo, string>> = {
  categoria: dotEsmeralda,
  'en-stock': dotEsmeralda,
  'pocas-unidades': dotAviso,
};

interface BadgeProps {
  tipo: BadgeTipo;
  children: ReactNode;
  className?: string;
}

// Badge de estado/promoción. El de descuento va arriba a la izquierda de la foto del producto.
export default function Badge({ tipo, children, className = '' }: BadgeProps) {
  const dot = DOTS[tipo];
  return (
    <span className={`inline-flex items-center rounded-pill whitespace-nowrap ${STYLES[tipo]} ${className}`}>
      {dot && <img src={dot} alt="" width={7} height={7} className="shrink-0" />}
      {children}
    </span>
  );
}
