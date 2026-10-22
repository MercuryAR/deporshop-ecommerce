import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import { getProducto, formatearPrecio } from '../services/api';
import { useCartStore } from '../store/cartStore';
import ProductImage from '../components/ProductImage';
import Rating from '../components/Rating';
import { ArrowLeftIcon, CheckIcon } from '../components/Icons';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProducto(id)
      .then(setProducto)
      .catch(() => setError('No se pudo cargar el producto.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-app py-10 grid md:grid-cols-2 gap-10 animate-pulse" role="status" aria-label="Cargando producto">
        <div className="aspect-square rounded-xl bg-gray-100" />
        <div className="flex flex-col gap-4 pt-2">
          <div className="h-4 w-1/4 bg-gray-100 rounded" />
          <div className="h-9 w-3/4 bg-gray-100 rounded" />
          <div className="h-8 w-1/3 bg-gray-100 rounded" />
          <div className="h-24 w-full bg-gray-100 rounded" />
          <div className="h-12 w-48 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="text-center py-24">
        <p className="text-error font-semibold mb-4">{error || 'Producto no encontrado.'}</p>
        <Link to="/productos" className="btn-primary">
          Volver a productos
        </Link>
      </div>
    );
  }

  const tieneDescuento = producto.descuento > 0;
  const precioFinal = producto.precio * (1 - producto.descuento / 100);

  async function handleAdd() {
    setAdding(true);
    try {
      await addItem(producto!.id, cantidad);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="container-app py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
          <ProductImage src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full" />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-2">
            {producto.categoria?.nombre || 'Producto'}
          </p>
          <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>

          {producto.rating > 0 && (
            <div className="mb-4">
              <Rating value={producto.rating} reviews={producto.resenas} size="md" />
            </div>
          )}

          <div className="mb-6">
            {tieneDescuento ? (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-bold text-accent">{formatearPrecio(precioFinal)}</span>
                <span className="text-lg line-through text-gray-500">
                  {formatearPrecio(producto.precio)}
                </span>
                <span className="bg-accent text-white px-2.5 py-1 rounded-md text-sm font-bold">
                  -{Math.round(producto.descuento)}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">{formatearPrecio(producto.precio)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{producto.descripcion}</p>

          {producto.stock === 0 ? (
            <p className="text-error font-bold mb-6">Producto agotado</p>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              {producto.stock < 5 ? `Quedan ${producto.stock} unidades` : 'En stock'}
            </p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="cantidad" className="font-semibold">
              Cantidad
            </label>
            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 border border-gray-200 rounded-md font-bold hover:bg-primary hover:text-white transition-colors"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <input
                id="cantidad"
                type="number"
                min={1}
                max={producto.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 text-center border border-gray-200 rounded-md py-1.5"
              />
              <button
                className="w-9 h-9 border border-gray-200 rounded-md font-bold hover:bg-primary hover:text-white transition-colors"
                onClick={() => setCantidad((c) => Math.min(producto.stock || 99, c + 1))}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <button
            className="btn-accent w-full md:w-auto text-lg px-8 py-3 disabled:opacity-60"
            disabled={producto.stock === 0 || adding}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <CheckIcon className="w-5 h-5" /> Agregado al carrito
              </>
            ) : adding ? (
              'Agregando…'
            ) : (
              'Agregar al carrito'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
