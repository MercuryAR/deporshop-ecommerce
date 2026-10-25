import starFilled from '../assets/icons/star-filled.svg';

interface RatingProps {
  value: number;
  reviews?: number;
  size?: 'sm' | 'md';
}

// Rating del UI kit: estrella Esmeralda + "4.5 · 42 reseñas".
export default function Rating({ value, reviews, size = 'sm' }: RatingProps) {
  const star = size === 'sm' ? 14 : 18;
  return (
    <div className="flex items-center gap-1.5" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      <img src={starFilled} alt="" width={star} height={star} className="shrink-0" />
      <span className={`text-musgo ${size === 'sm' ? 'text-caption' : 'text-body-sm'}`}>
        {value.toFixed(1)}
        {reviews !== undefined && ` · ${reviews} reseña${reviews === 1 ? '' : 's'}`}
      </span>
    </div>
  );
}
