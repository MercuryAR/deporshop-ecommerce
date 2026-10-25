import type { CarritoItem } from '../types/Carrito';
import { formatearPrecio } from '../services/api';
import { useCartStore } from '../store/cartStore';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';
import Icon from './Icons';

interface CartItemProps {
  item: CarritoItem;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-3 bg-white border border-borde rounded-md">
      <ProductImage src={item.imagenUrl} alt={item.nombre} placeholderSize={40} className="size-20 sm:size-[88px] shrink-0 rounded-sm" />

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-body-strong font-bold truncate">{item.nombre}</p>
        <p className="text-caption text-musgo">{formatearPrecio(item.precio)} c/u</p>
        <p className="font-price font-extrabold text-price">{formatearPrecio(item.subtotal)}</p>
      </div>

      <div className="flex items-center justify-between gap-3 w-full sm:w-auto pl-[92px] sm:pl-0">
        <QuantityStepper
          value={item.cantidad}
          onChange={(c) => updateQuantity(item.productoId, c)}
          label={`Cantidad de ${item.nombre}`}
        />
        <button
          type="button"
          className="flex items-center justify-center size-9 rounded-pill text-bosque hover:text-error hover:bg-error-suave transition-colors"
          onClick={() => removeItem(item.productoId)}
          aria-label={`Eliminar ${item.nombre} del carrito`}
        >
          <Icon name="trash" size={18} />
        </button>
      </div>
    </div>
  );
}
