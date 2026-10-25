import { useState } from 'react';
import placeholder from '../assets/ui/placeholder.svg';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholderSize?: number;
}

// /img/placeholder.png no existe: reasignarlo en onError volvía a fallar en bucle.
// Si la imagen falla se muestra el "Ícono placeholder" del Product Card sin foto, sin otra request.
export default function ProductImage({ src, alt, className = '', placeholderSize = 72 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-aire ${className}`}>
        <img src={placeholder} alt="" width={placeholderSize} height={placeholderSize} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover bg-aire ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
