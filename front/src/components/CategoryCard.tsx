import { Link } from 'react-router-dom';
import Icon, { type IconName } from './Icons';

export type CategoryColor = 'menta' | 'esmeralda' | 'lima';

const COLORS: Record<CategoryColor, { card: string; text: string; ilustracion: string }> = {
  menta: { card: 'bg-menta hover:bg-[#d9eee2]', text: 'text-bosque', ilustracion: 'text-esmeralda' },
  esmeralda: { card: 'bg-esmeralda hover:bg-esmeralda-oscuro', text: 'text-white', ilustracion: 'text-lima' },
  lima: { card: 'bg-lima hover:bg-lima-oscuro', text: 'text-bosque', ilustracion: 'text-bosque' },
};

// Ilustración según la categoría, como en el UI kit (Zapatillas → pulse, Ropa → shirt, Accesorios → briefcase).
function ilustracionCategoria(nombre: string): IconName {
  const n = nombre.toLowerCase();
  if (n.includes('ropa') || n.includes('remera')) return 'shirt';
  if (n.includes('accesorio') || n.includes('mochila')) return 'briefcase';
  return 'pulse';
}

interface CategoryCardProps {
  to: string;
  categoria: string;
  cantidad: number;
  color: CategoryColor;
}

export default function CategoryCard({ to, categoria, cantidad, color }: CategoryCardProps) {
  const c = COLORS[color];
  return (
    <Link
      to={to}
      className={`group relative flex flex-col justify-between h-[180px] sm:h-[240px] p-6 rounded-lg overflow-hidden transition-colors ${c.card} ${c.text}`}
    >
      <p className="text-label-sm font-semibold">
        {cantidad} producto{cantidad === 1 ? '' : 's'}
      </p>
      <Icon
        name={ilustracionCategoria(categoria)}
        size={100}
        className={`absolute top-6 right-6 opacity-90 scale-75 sm:scale-100 origin-top-right transition-transform group-hover:-rotate-6 ${c.ilustracion}`}
      />
      <p className="relative flex items-center gap-2 text-h3 font-extrabold">
        {categoria}
        <Icon name="arrow-up-right" size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
