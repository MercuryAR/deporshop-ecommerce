import type { CSSProperties } from 'react';
import search from '../assets/icons/search.svg';
import user from '../assets/icons/user.svg';
import bag from '../assets/icons/bag.svg';
import heart from '../assets/icons/heart.svg';
import star from '../assets/icons/star.svg';
import starFilled from '../assets/icons/star-filled.svg';
import arrowRight from '../assets/icons/arrow-right.svg';
import arrowUpRight from '../assets/icons/arrow-up-right.svg';
import chevronDown from '../assets/icons/chevron-down.svg';
import plus from '../assets/icons/plus.svg';
import minus from '../assets/icons/minus.svg';
import x from '../assets/icons/x.svg';
import check from '../assets/icons/check.svg';
import menu from '../assets/icons/menu.svg';
import trash from '../assets/icons/trash.svg';
import truck from '../assets/icons/truck.svg';
import rotate from '../assets/icons/rotate.svg';
import shield from '../assets/icons/shield.svg';
import award from '../assets/icons/award.svg';
import shirt from '../assets/icons/shirt.svg';
import briefcase from '../assets/icons/briefcase.svg';
import pulse from '../assets/icons/pulse.svg';

// Set Icon/* del Design System (trazo 2px · grilla 24). Los SVG exportados de Figma
// vienen en Bosque; se usan como máscara para que tomen el color del texto (currentColor).
const ICONS = {
  search,
  user,
  bag,
  heart,
  star,
  'star-filled': starFilled,
  'arrow-right': arrowRight,
  'arrow-up-right': arrowUpRight,
  'chevron-down': chevronDown,
  plus,
  minus,
  x,
  check,
  menu,
  trash,
  truck,
  rotate,
  shield,
  award,
  shirt,
  briefcase,
  pulse,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 24, className = '' }: IconProps) {
  const url = `url("${ICONS[name]}")`;
  const style: CSSProperties = {
    width: size,
    height: size,
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={style} />;
}
