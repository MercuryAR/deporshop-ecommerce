import type { ReactNode } from 'react';

interface LineItemProps {
  concepto: ReactNode;
  monto: ReactNode;
}

// Fila concepto / monto para resúmenes de compra y pedidos.
export default function LineItem({ concepto, monto }: LineItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 text-body">
      <span className="text-musgo min-w-0">{concepto}</span>
      <span className="font-bold leading-[1.5] text-bosque whitespace-nowrap">{monto}</span>
    </div>
  );
}
