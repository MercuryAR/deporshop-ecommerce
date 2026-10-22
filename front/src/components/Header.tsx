import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CartIcon, CloseIcon, MenuIcon, UserIcon } from './Icons';

const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const cantidad = useCartStore((s) => s.cantidad);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white hover:bg-white/10'
    }`;

  const iconButton =
    'relative w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/15 transition-colors';

  return (
    <header className="bg-primary text-white sticky top-0 z-50 border-b border-white/10">
      <div className="container-app flex items-center justify-between gap-4 h-16">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
            <rect width="32" height="32" rx="8" className="fill-accent" />
            <path d="M8 21 L14 11 L18 17 L21 13 L25 21" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span className="font-display italic text-2xl font-extrabold uppercase tracking-wide">
            Depor<span className="text-accent">Shop</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-1" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to={isAuthenticated ? '/perfil' : '/login'}
            aria-label={isAuthenticated ? 'Mi perfil' : 'Iniciar sesión'}
            className={iconButton}
          >
            <UserIcon />
          </Link>
          <Link
            to="/carrito"
            aria-label={`Carrito de compras${cantidad > 0 ? `, ${cantidad} productos` : ''}`}
            className={iconButton}
          >
            <CartIcon />
            {cantidad > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[11px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 ring-2 ring-primary">
                {cantidad}
              </span>
            )}
          </Link>
          <button
            className={`md:hidden ${iconButton}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="menu-movil" className="md:hidden flex flex-col gap-1 px-4 pb-4 border-t border-white/10 pt-3" aria-label="Navegación móvil">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
