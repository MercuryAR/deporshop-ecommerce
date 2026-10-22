import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCartStore, ENVIO_GRATIS_DESDE } from '../store/cartStore';
import { formatearPrecio } from '../services/api';
import { CartIcon, TruckIcon } from '../components/Icons';

export default function Cart() {
  const { items, loading, clear, getSubtotal, getEnvio, getTotalConEnvio } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const envio = getEnvio();
  const total = getTotalConEnvio();
  const faltaParaEnvioGratis = ENVIO_GRATIS_DESDE - subtotal;

  async function handleClear() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      await clear();
    }
  }

  if (loading && items.length === 0) {
    return <p className="text-center py-24 text-gray-500">Cargando carrito…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <CartIcon className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Agrega productos para comenzar tu compra</p>
        <Link to="/productos" className="btn-primary">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <h1 className="text-3xl font-bold mb-8">Tu carrito</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <CartItem key={item.productoId} item={item} />
          ))}

          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/productos" className="btn-secondary">
              Continuar comprando
            </Link>
            <button className="btn-ghost text-gray-500 hover:text-error" onClick={handleClear}>
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl h-fit flex flex-col gap-4 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Resumen del pedido</h2>

          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>{formatearPrecio(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Envío</span>
            <span>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</span>
          </div>

          <div className="text-sm">
            <p className="flex items-center gap-2 mb-2 text-gray-700">
              <TruckIcon className="w-4 h-4 text-success" />
              {faltaParaEnvioGratis > 0 ? (
                <span>
                  Agrega <strong>{formatearPrecio(faltaParaEnvioGratis)}</strong> más para envío gratis
                </span>
              ) : (
                <span className="font-semibold text-success">¡Tienes envío gratis!</span>
              )}
            </p>
            <div
              className="h-1.5 rounded-full bg-gray-200 overflow-hidden"
              role="progressbar"
              aria-label="Progreso hacia envío gratis"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(Math.min(subtotal / ENVIO_GRATIS_DESDE, 1) * 100)}
            >
              <div
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${Math.min(subtotal / ENVIO_GRATIS_DESDE, 1) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-gray-200">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </div>

          <button className="btn-accent w-full mt-2" onClick={() => navigate('/checkout')}>
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}
