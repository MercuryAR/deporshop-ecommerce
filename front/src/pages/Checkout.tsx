import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { crearPedido, formatearPrecio } from '../services/api';
import LineItem from '../components/LineItem';

export default function Checkout() {
  const { items, clear, getSubtotal, getEnvio, getTotalConEnvio } = useCartStore();
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleConfirmar() {
    setConfirmando(true);
    setError(null);
    try {
      const pedido = await crearPedido(
        items.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad })),
      );
      await clear();
      navigate('/perfil', { state: { pedidoConfirmado: pedido.id } });
    } catch (err) {
      console.error('Error al confirmar el pedido:', err);
      setError('No se pudo confirmar el pedido. Intenta nuevamente.');
      setConfirmando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <p className="text-body-lg text-musgo mb-6">No hay productos en tu carrito para pagar.</p>
        <Link to="/productos" className="btn-primary">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10 md:py-14 max-w-2xl">
      <p className="section-overline mb-3">Checkout</p>
      <h1 className="font-display text-[32px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mb-8">RESUMEN DE COMPRA</h1>

      <div className="card p-6 mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <LineItem key={item.productoId} concepto={`${item.nombre} x${item.cantidad}`} monto={formatearPrecio(item.subtotal)} />
          ))}
        </div>

        <div className="h-px bg-borde" />
        <LineItem concepto="Subtotal" monto={formatearPrecio(getSubtotal())} />
        <LineItem concepto="Envío" monto={getEnvio() === 0 ? 'Gratis' : formatearPrecio(getEnvio())} />
        <div className="h-px bg-borde" />
        <div className="flex items-center justify-between">
          <span className="text-body-strong font-bold">Total</span>
          <span className="font-price font-extrabold text-price-lg">{formatearPrecio(getTotalConEnvio())}</span>
        </div>
      </div>

      {error && <p className="text-body-sm text-error bg-error-suave rounded-sm px-4 py-3 mb-4">{error}</p>}

      <button
        type="button"
        className="btn-primary btn-lg relative overflow-hidden w-full disabled:bg-esmeralda disabled:text-white"
        onClick={handleConfirmar}
        disabled={confirmando}
      >
        {confirmando && <span className="btn-loading-bar" aria-hidden="true" />}
        <span className="relative">{confirmando ? 'Confirmando...' : 'Confirmar pedido'}</span>
      </button>
    </div>
  );
}
