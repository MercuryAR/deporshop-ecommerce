import Icon, { type IconName } from './Icons';

interface BenefitCardProps {
  icon: IconName;
  titulo: string;
  descripcion: string;
}

// Benefit Card para la franja de beneficios.
export default function BenefitCard({ icon, titulo, descripcion }: BenefitCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-borde rounded-md">
      <span className="flex items-center justify-center size-10 shrink-0 rounded-sm bg-menta text-bosque">
        <Icon name={icon} size={20} />
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-label-sm font-bold">{titulo}</p>
        <p className="text-caption text-musgo">{descripcion}</p>
      </div>
    </div>
  );
}
