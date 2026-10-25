import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import { formatearPrecio } from '../services/api';
import { useCartStore } from '../store/cartStore';
import ProductImage from './ProductImage';
import Rating from './Rating';
import Badge from './Badge';
import Icon from './Icons';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [favorito, setFavorito] = useState(false);

  const tieneDescuento = producto.descuento > 0;
  const agotado = producto.stock === 0;
  const precioFinal = producto.precio * (1 - producto.descuento / 100);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addItem(producto.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="group flex flex-col h-full gap-1 p-2 bg-white rounded-md transition-shadow hover:shadow-floating">
      <div className="relative aspect-[264/248] rounded-sm overflow-hidden bg-aire">
        <Link to={`/producto/${producto.id}`} tabIndex={-1} aria-hidden="true">
          <ProductImage
            src={producto.imagenUrl}
            alt=""
            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              agotado ? 'opacity-50 grayscale' : ''
            }`}
          />
        </Link>
        <div className="absolute inset-x-3 top-3 flex items-start justify-between pointer-events-none">
          {agotado ? (
            <Badge tipo="agotado">Agotado</Badge>
          ) : tieneDescuento ? (
            <Badge tipo="descuento">-{Math.round(producto.descuento)}%</Badge>
          ) : (
            <span />
          )}
          <button
            type="button"
            className={`pointer-events-auto flex items-center justify-center size-8 rounded-pill border border-borde transition-colors ${
              favorito ? 'bg-bosque text-lima border-bosque' : 'bg-white text-bosque hover:bg-menta'
            }`}
            aria-label={favorito ? `Quitar ${producto.nombre} de favoritos` : `Agregar ${producto.nombre} a favoritos`}
            aria-pressed={favorito}
            onClick={() => setFavorito((f) => !f)}
          >
            <Icon name="heart" size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-1 p-3">
        <p className="text-overline font-bold uppercase text-musgo">{producto.categoria?.nombre || 'Producto'}</p>
        <Link to={`/producto/${producto.id}`} className="text-body-strong font-bold line-clamp-2 hover:text-esmeralda transition-colors">
          {producto.nombre}
        </Link>

        {producto.rating > 0 && <Rating value={producto.rating} reviews={producto.resenas} />}

        {producto.stock > 0 && producto.stock < 5 && (
          <Badge tipo="pocas-unidades">Últimas {producto.stock} unidades</Badge>
        )}

        <div className="flex flex-wrap items-end justify-between gap-2 mt-auto pt-2">
          <div className="min-w-0">
            <p className="font-price font-extrabold text-[17px] leading-[1.2] tracking-[-0.3px] sm:text-price">
              {formatearPrecio(tieneDescuento ? precioFinal : producto.precio)}
            </p>
            {tieneDescuento && (
              <p className="text-price-old text-musgo line-through">{formatearPrecio(producto.precio)}</p>
            )}
          </div>
          <button
            type="button"
            className={`ml-auto flex items-center justify-center size-10 shrink-0 rounded-pill text-white transition-colors disabled:bg-borde disabled:text-musgo disabled:cursor-not-allowed ${
              added ? 'bg-esmeralda-oscuro' : 'bg-esmeralda hover:bg-esmeralda-oscuro'
            }`}
            disabled={agotado || adding}
            onClick={handleAddToCart}
            aria-label={added ? `${producto.nombre} agregado al carrito` : `Agregar ${producto.nombre} al carrito`}
            aria-live="polite"
          >
            <Icon name={added ? 'check' : 'plus'} size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
