import type { Pedido } from '../types/Pedido';
import { formatearPrecio } from '../services/api';
import Badge, { type BadgeTipo } from './Badge';
import LineItem from './LineItem';

function tipoEstado(estado: string): BadgeTipo {
  const e = estado.toLowerCase();
  if (e.includes('cancel')) return 'agotado';
  if (e.includes('pend')) return 'pocas-unidades';
  return 'en-stock';
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Tarjeta de pedido del historial (Perfil). Estado con Badge, ítems con Line Item.
export default function OrderCard({ pedido }: { pedido: Pedido }) {
  const estado = pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1).toLowerCase();
  return (
    <article className="card p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-h4 font-bold">Pedido #{pedido.id}</h3>
          <p className="text-body-sm text-musgo">{formatearFecha(pedido.fecha)}</p>
        </div>
        <Badge tipo={tipoEstado(pedido.estado)}>{estado}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {pedido.items.map((item) => (
          <LineItem key={item.productoId} concepto={`${item.nombre} x${item.cantidad}`} monto={formatearPrecio(item.subtotal)} />
        ))}
      </div>
      <div className="h-px bg-borde" />
      <div className="flex items-center justify-between">
        <span className="text-body-strong font-bold">Total</span>
        <span className="font-price font-extrabold text-price">{formatearPrecio(pedido.total)}</span>
      </div>
    </article>
  );
}
