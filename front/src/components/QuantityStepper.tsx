import Icon from './Icons';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export default function QuantityStepper({ value, onChange, min = 1, max = 99, label = 'Cantidad' }: QuantityStepperProps) {
  const stepBtn =
    'flex items-center justify-center size-8 rounded-pill bg-menta text-bosque transition-colors hover:bg-borde disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-1 p-1 bg-white border border-borde rounded-pill shrink-0"
    >
      <button type="button" className={stepBtn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Disminuir cantidad">
        <Icon name="minus" size={16} />
      </button>
      <span className="flex items-center justify-center min-w-8 h-8 text-body-strong font-bold" aria-live="polite">
        {value}
      </span>
      <button type="button" className={stepBtn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar cantidad">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
