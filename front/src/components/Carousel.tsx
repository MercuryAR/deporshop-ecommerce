import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icons';

export interface CarouselSlide {
  id: number | string;
  image: string;
  title: string;
  subtitle?: string;
  linkTo?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayMs?: number;
}

export default function Carousel({ slides, autoPlayMs = 4000 }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!autoPlayMs || slides.length <= 1 || paused || reducedMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlayMs, slides.length, paused]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full rounded-lg md:rounded-xl overflow-hidden bg-esmeralda-oscuro"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Destacados"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="min-w-full relative aspect-[4/3]"
            role="group"
            aria-roledescription="diapositiva"
            aria-hidden={i !== index}
            aria-label={`${i + 1} de ${slides.length}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bosque/80 via-bosque/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-12 sm:p-6 sm:pb-14 text-white">
              <h3 className="font-display uppercase text-[24px] sm:text-h2">{slide.title}</h3>
              {slide.subtitle && <p className="mt-1 text-body-sm text-menta">{slide.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={prev}
            className="icon-btn absolute top-1/2 -translate-y-1/2 left-3 sm:left-4 z-10"
          >
            <Icon name="chevron-down" size={18} className="rotate-90" />
          </button>
          <button
            aria-label="Siguiente"
            onClick={next}
            className="icon-btn absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 z-10"
          >
            <Icon name="chevron-down" size={18} className="-rotate-90" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-bosque/40 backdrop-blur px-3 py-1.5 rounded-pill z-10">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-2 rounded-pill transition-all ${
                  i === index ? 'w-5 bg-lima' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
