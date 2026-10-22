import { StarIcon } from './Icons';

interface RatingProps {
  value: number;
  reviews?: number;
  size?: 'sm' | 'md';
}

export default function Rating({ value, reviews, size = 'sm' }: RatingProps) {
  const rounded = Math.round(value);
  const star = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-amber-400" role="img" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < rounded} className={star} />
        ))}
      </div>
      {reviews !== undefined && (
        <span className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviews}
          {size === 'md' ? ' reseñas' : ''})
        </span>
      )}
    </div>
  );
}
