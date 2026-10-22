import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import { formatearPrecio } from '../services/api';
import { useCartStore } from '../store/cartStore';
import ProductImage from './ProductImage';
import Rating from './Rating';
import { CheckIcon } from './Icons';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const tieneDescuento = producto.descuento > 0;
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
    <article className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/producto/${producto.id}`} className="relative aspect-square block overflow-hidden bg-gray-100">
        <ProductImage
          src={producto.imagenUrl}
          alt={producto.nombre}
          className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
            producto.stock === 0 ? 'opacity-50 grayscale' : ''
          }`}
        />
        {tieneDescuento && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-md">
            -{Math.round(producto.descuento)}%
          </span>
        )}
        {producto.stock === 0 && (
          <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md">
            Agotado
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-grow p-5">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
          {producto.categoria?.nombre || 'Producto'}
        </p>
        <Link to={`/producto/${producto.id}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-accent transition-colors">
            {producto.nombre}
          </h3>
        </Link>

        {producto.rating > 0 && (
          <div className="mb-3">
            <Rating value={producto.rating} reviews={producto.resenas} />
          </div>
        )}

        {producto.stock > 0 && producto.stock < 5 && (
          <p className="text-amber-700 font-medium text-xs mb-3">¡Últimas {producto.stock} unidades!</p>
        )}

        <div className="flex items-end justify-between gap-3 mt-auto pt-3 border-t border-gray-200 min-h-[4.25rem]">
          <div>
            {tieneDescuento ? (
              <>
                <span className="block text-xl font-bold text-accent">
                  {formatearPrecio(precioFinal)}
                </span>
                <span className="block text-sm line-through text-gray-400">
                  {formatearPrecio(producto.precio)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">{formatearPrecio(producto.precio)}</span>
            )}
          </div>
          <button
            className={`text-sm py-2 px-4 ${added ? 'btn bg-success text-white' : 'btn-primary'}`}
            disabled={producto.stock === 0 || adding}
            onClick={handleAddToCart}
            aria-live="polite"
          >
            {added ? (
              <>
                <CheckIcon className="w-4 h-4" /> Agregado
              </>
            ) : adding ? (
              'Agregando…'
            ) : (
              'Agregar'
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
