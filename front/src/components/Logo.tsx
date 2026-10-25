import Icon from './Icons';

type LogoVersion = 'color' | 'invertido' | 'mono-bosque' | 'mono-blanco';

// Isotipo de pulso + wordmark en Archivo Black. Versiones del Figma:
// Color (fondos claros), Invertido (Bosque/fotos oscuras), Mono Bosque (sobre Lima), Mono Blanco (sobre Esmeralda).
const VERSIONS: Record<LogoVersion, { box: string; glyph: string; text: string }> = {
  color: { box: 'bg-esmeralda', glyph: 'text-white', text: 'text-bosque' },
  invertido: { box: 'bg-lima', glyph: 'text-bosque', text: 'text-white' },
  'mono-bosque': { box: 'bg-bosque', glyph: 'text-lima', text: 'text-bosque' },
  'mono-blanco': { box: 'bg-white', glyph: 'text-esmeralda', text: 'text-white' },
};

interface IsotipoProps {
  version?: LogoVersion;
  size?: number;
}

export function Isotipo({ version = 'color', size = 36 }: IsotipoProps) {
  const v = VERSIONS[version];
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${v.box} ${v.glyph}`}
      style={{ width: size, height: size, borderRadius: (size * 10) / 36 }}
    >
      <Icon name="pulse" size={(size * 20) / 36} />
    </span>
  );
}

interface LogoProps {
  version?: LogoVersion;
  className?: string;
}

export default function Logo({ version = 'color', className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Isotipo version={version} />
      <span className={`font-display text-[20px] sm:text-[26px] leading-none tracking-[-0.5px] ${VERSIONS[version].text}`}>
        DEPORSHOP
      </span>
    </span>
  );
}
