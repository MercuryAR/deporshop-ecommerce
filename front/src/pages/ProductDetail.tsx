import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import { getProducto, formatearPrecio } from '../services/api';
import { useCartStore, ENVIO_GRATIS_DESDE } from '../store/cartStore';
import ProductImage from '../components/ProductImage';
import Rating from '../components/Rating';
import Badge from '../components/Badge';
import QuantityStepper from '../components/QuantityStepper';
import Icon from '../components/Icons';

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
      <div className="container-app py-10 grid md:grid-cols-2 gap-8 lg:gap-14 animate-pulse" role="status" aria-label="Cargando producto">
        <div className="aspect-square rounded-lg bg-white" />
        <div className="flex flex-col gap-4 pt-2">
          <div className="h-6 w-28 bg-menta rounded-pill" />
          <div className="h-11 w-3/4 bg-menta rounded-pill" />
          <div className="h-8 w-1/3 bg-menta rounded-pill" />
          <div className="h-24 w-full bg-menta rounded-md" />
          <div className="h-14 w-56 bg-menta rounded-pill" />
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container-app text-center py-24">
        <p className="text-error font-semibold mb-6">{error || 'Producto no encontrado.'}</p>
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
    <div className="container-app py-8 md:py-12">
      <button type="button" onClick={() => navigate(-1)} className="btn-text btn-sm -ml-4 mb-6">
        <Icon name="arrow-right" size={16} className="rotate-180" /> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-white border border-borde">
          <ProductImage src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full" />
          {tieneDescuento && (
            <Badge tipo="descuento" className="absolute top-4 left-4">
              -{Math.round(producto.descuento)}%
            </Badge>
          )}
        </div>

        <div className="flex flex-col">
          <Badge tipo="categoria" className="self-start mb-4">
            {producto.categoria?.nombre || 'Producto'}
          </Badge>
          <h1 className="font-display uppercase text-[32px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mb-4">{producto.nombre}</h1>

          {producto.rating > 0 && (
            <div className="mb-6">
              <Rating value={producto.rating} reviews={producto.resenas} size="md" />
            </div>
          )}

          <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-6">
            <span className="font-price font-extrabold text-price-lg">
              {formatearPrecio(tieneDescuento ? precioFinal : producto.precio)}
            </span>
            {tieneDescuento && (
              <span className="text-body text-musgo line-through">{formatearPrecio(producto.precio)}</span>
            )}
          </div>

          <p className="text-body text-musgo mb-6">{producto.descripcion}</p>

          <div className="mb-6">
            {producto.stock === 0 ? (
              <Badge tipo="agotado">Producto agotado</Badge>
            ) : producto.stock < 5 ? (
              <Badge tipo="pocas-unidades">Últimas {producto.stock} unidades</Badge>
            ) : (
              <Badge tipo="en-stock">En stock</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-borde">
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-label-sm font-semibold">Cantidad</span>
              <QuantityStepper
                value={cantidad}
                onChange={(c) => setCantidad(Math.max(1, Math.min(producto.stock || 99, c)))}
                max={producto.stock || 99}
              />
            </div>
            <button
              type="button"
              className="btn-primary btn-lg flex-1 basis-[240px]"
              disabled={producto.stock === 0 || adding}
              onClick={handleAdd}
            >
              {added ? (
                <>
                  Agregado al carrito <Icon name="check" size={20} />
                </>
              ) : adding ? (
                'Agregando…'
              ) : (
                <>
                  Agregar al carrito <Icon name="bag" size={20} />
                </>
              )}
            </button>
          </div>

          <ul className="grid gap-3 mt-8 text-body-sm">
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center size-8 rounded-sm bg-menta"><Icon name="truck" size={16} /></span>
              Envío gratis en compras desde {formatearPrecio(ENVIO_GRATIS_DESDE)}
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center size-8 rounded-sm bg-menta"><Icon name="rotate" size={16} /></span>
              Cambios sin cargo durante 30 días
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
