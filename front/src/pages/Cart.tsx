import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import LineItem from '../components/LineItem';
import Icon from '../components/Icons';
import { useCartStore, ENVIO_GRATIS_DESDE } from '../store/cartStore';
import { formatearPrecio } from '../services/api';

export default function Cart() {
  const { items, loading, clear, getSubtotal, getEnvio, getTotalConEnvio } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const envio = getEnvio();
  const total = getTotalConEnvio();
  const faltaParaEnvioGratis = ENVIO_GRATIS_DESDE - subtotal;
  const progreso = Math.min(subtotal / ENVIO_GRATIS_DESDE, 1) * 100;

  async function handleClear() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      await clear();
    }
  }

  if (loading && items.length === 0) {
    return <p className="text-center py-24 text-musgo">Cargando carrito…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <div className="size-20 mx-auto mb-6 rounded-pill bg-menta text-esmeralda flex items-center justify-center">
          <Icon name="bag" size={36} />
        </div>
        <h1 className="font-display text-h2 mb-3">TU CARRITO ESTÁ VACÍO</h1>
        <p className="text-musgo mb-8">Agregá productos para comenzar tu compra</p>
        <Link to="/productos" className="btn-primary">
          Ver productos <Icon name="arrow-right" size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10 md:py-14">
      <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mb-8">TU CARRITO</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <CartItem key={item.productoId} item={item} />
          ))}

          <div className="flex flex-wrap gap-3 mt-2">
            <Link to="/productos" className="btn-secondary">
              Continuar comprando
            </Link>
            <button type="button" className="btn text-musgo hover:text-error hover:bg-error-suave" onClick={handleClear}>
              <Icon name="trash" size={18} /> Vaciar carrito
            </button>
          </div>
        </div>

        <aside className="card p-6 h-fit flex flex-col gap-4 lg:sticky lg:top-36">
          <h2 className="text-h4 font-bold">Resumen del pedido</h2>

          <LineItem concepto="Subtotal" monto={formatearPrecio(subtotal)} />
          <LineItem concepto="Envío" monto={envio === 0 ? 'Gratis' : formatearPrecio(envio)} />

          <div className="p-4 rounded-sm bg-menta text-body-sm">
            <p className="flex items-center gap-2 mb-3 text-esmeralda-oscuro">
              <Icon name="truck" size={18} />
              {faltaParaEnvioGratis > 0 ? (
                <span>
                  Agregá <strong>{formatearPrecio(faltaParaEnvioGratis)}</strong> más para envío gratis
                </span>
              ) : (
                <span className="font-bold">¡Tenés envío gratis!</span>
              )}
            </p>
            <div
              className="h-1.5 rounded-pill bg-white overflow-hidden"
              role="progressbar"
              aria-label="Progreso hacia envío gratis"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progreso)}
            >
              <div className="h-full bg-esmeralda transition-all duration-500" style={{ width: `${progreso}%` }} />
            </div>
          </div>

          <div className="h-px bg-borde" />
          <div className="flex items-center justify-between">
            <span className="text-body-strong font-bold">Total</span>
            <span className="font-price font-extrabold text-price-lg">{formatearPrecio(total)}</span>
          </div>

          <button type="button" className="btn-primary btn-lg w-full mt-2" onClick={() => navigate('/checkout')}>
            Proceder al pago <Icon name="arrow-right" size={20} />
          </button>
        </aside>
      </div>
    </div>
  );
}
