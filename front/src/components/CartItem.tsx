import type { CarritoItem } from '../types/Carrito';
import { formatearPrecio } from '../services/api';
import { useCartStore } from '../store/cartStore';
import ProductImage from './ProductImage';
import { TrashIcon } from './Icons';

interface CartItemProps {
  item: CarritoItem;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto_auto] gap-4 items-center p-4 sm:p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <ProductImage
        src={item.imagenUrl}
        alt={item.nombre}
        className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-md row-span-2 sm:row-span-1"
      />

      <div className="flex flex-col gap-1 col-start-2 sm:col-start-auto">
        <h4 className="text-lg font-semibold text-gray-900">{item.nombre}</h4>
        <p className="text-sm text-gray-500">{formatearPrecio(item.precio)} c/u</p>

        <div className="flex items-center gap-2 mt-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors"
            onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={item.cantidad}
            onChange={(e) => updateQuantity(item.productoId, parseInt(e.target.value, 10) || 1)}
            className="w-14 text-center border border-gray-200 rounded-md py-1"
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors"
            onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      <div className="col-start-2 sm:col-start-auto text-right font-bold text-lg text-gray-900 sm:min-w-[100px]">
        {formatearPrecio(item.subtotal)}
      </div>

      <button
        className="col-start-2 sm:col-start-auto justify-self-end w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:text-error hover:bg-red-50 transition-colors"
        onClick={() => removeItem(item.productoId)}
        aria-label={`Eliminar ${item.nombre} del carrito`}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
