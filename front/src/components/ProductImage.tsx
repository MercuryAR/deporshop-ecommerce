import { useState } from 'react';
import { ImageIcon } from './Icons';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

// /img/placeholder.png no existe: reasignarlo en onError volvía a fallar en bucle.
// Si la imagen falla se muestra un placeholder dibujado, sin otra request.
export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gray-100 text-gray-300 ${className}`}
      >
        <ImageIcon className="w-1/4 h-1/4 max-w-12 max-h-12" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
