import { Link } from 'react-router-dom';
import deco from '../assets/ui/promo-deco.svg';
import Icon from './Icons';

interface PromoBannerProps {
  descuento: number;
  bajada?: string;
}

export default function PromoBanner({ descuento, bajada = 'Running, trail y tenis. Por tiempo limitado.' }: PromoBannerProps) {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 sm:p-10 bg-bosque rounded-lg sm:rounded-xl overflow-hidden">
      <img
        src={deco}
        alt=""
        width={260}
        height={260}
        className="absolute -top-[60px] right-[-80px] md:right-auto md:left-[52%] pointer-events-none"
      />
      <div className="relative flex flex-col gap-3">
        <h2 className="font-display text-[26px] leading-[1.05] tracking-[-0.5px] sm:text-h2 text-white max-w-[380px]">
          HASTA <span className="text-lima">{descuento}% OFF</span> EN ZAPATILLAS
        </h2>
        <p className="text-body-sm text-menta">{bajada}</p>
      </div>
      <Link to="/productos?descuento=1" className="btn-lima relative self-start md:self-auto">
        Ver ofertas <Icon name="arrow-right" size={18} />
      </Link>
    </div>
  );
}
