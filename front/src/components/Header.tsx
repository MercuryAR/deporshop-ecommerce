import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore, ENVIO_GRATIS_DESDE } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { formatearPrecio } from '../services/api';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Icon from './Icons';

export default function Header() {
  const cantidad = useCartStore((s) => s.cantidad);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const categorias = useProductStore((s) => s.categorias);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const links = [
    { to: '/productos', label: 'Productos', active: location.pathname === '/productos' && !params.toString() },
    ...categorias.map((c) => ({
      to: `/productos?categoriaId=${c.id}`,
      label: c.nombre,
      active: params.get('categoriaId') === String(c.id),
    })),
    { to: '/productos?descuento=1', label: 'Ofertas', active: params.get('descuento') === '1', destacado: true },
    { to: '/contacto', label: 'Contacto', active: location.pathname === '/contacto' },
  ];

  const cuenta = isAuthenticated
    ? { to: '/perfil', label: 'Mi perfil', active: location.pathname === '/perfil' }
    : { to: '/login', label: 'Iniciar sesión', active: location.pathname === '/login' };

  const linkClass = (active: boolean, destacado?: boolean) =>
    `text-label-sm font-semibold whitespace-nowrap transition-colors hover:text-esmeralda ${
      destacado || active ? 'text-esmeralda' : 'text-bosque'
    } ${active ? 'underline underline-offset-[6px] decoration-2' : ''}`;

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-bosque text-menta text-caption text-center px-4 py-2">
        Envío gratis en compras desde <span className="text-lima">{formatearPrecio(ENVIO_GRATIS_DESDE)}</span>
        <span className="hidden sm:inline"> · Cambios sin cargo por 30 días</span>
      </div>

      <div className="border-b border-borde">
        <div className="container-app flex items-center gap-3 sm:gap-4 xl:gap-8 py-3 md:py-[14px]">
          <Link to="/" onClick={close} aria-label="DeporShop, ir al inicio" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden xl:flex flex-1 items-center gap-6 min-w-0" aria-label="Navegación principal">
            {links.map((l) => (
              <Link key={l.to} to={l.to} aria-current={l.active ? 'page' : undefined} className={linkClass(l.active, l.destacado)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <SearchBar className="hidden md:block flex-1 max-w-[480px] ml-auto xl:ml-0 xl:flex-none xl:w-[280px] 2xl:w-[320px]" />

          <div className="flex items-center gap-2 sm:gap-3 ml-auto md:ml-0 shrink-0">
            <Link to={cuenta.to} onClick={close} aria-label={cuenta.label} className="icon-btn hidden sm:inline-flex">
              <Icon name="user" size={18} />
            </Link>
            <Link
              to="/carrito"
              onClick={close}
              aria-label={`Carrito de compras, ${cantidad} producto${cantidad === 1 ? '' : 's'}`}
              className="flex items-center gap-2 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-pill bg-bosque text-white hover:bg-esmeralda-oscuro transition-colors"
            >
              <Icon name="bag" size={18} />
              <span className="flex items-center justify-center min-w-7 h-7 px-1.5 rounded-pill bg-lima text-bosque text-label-sm font-semibold">
                {cantidad}
              </span>
            </Link>
            <button
              type="button"
              className="icon-btn xl:hidden"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={18} />
            </button>
          </div>
        </div>

        <div className="container-app md:hidden pb-3">
          <SearchBar onSearch={close} />
        </div>
      </div>

      {menuOpen && (
        <nav
          id="menu-movil"
          className="xl:hidden absolute inset-x-0 top-full bg-white border-b border-borde shadow-floating"
          aria-label="Navegación móvil"
        >
          <ul className="container-app flex flex-col py-2">
            {[...links, { ...cuenta, destacado: false, mobileOnly: true }].map((l) => (
              <li key={l.to} className={'mobileOnly' in l ? 'sm:hidden' : ''}>
                <Link
                  to={l.to}
                  onClick={close}
                  aria-current={l.active ? 'page' : undefined}
                  className={`flex items-center justify-between py-3.5 border-b border-borde last:border-0 text-body-strong font-bold ${
                    l.destacado || l.active ? 'text-esmeralda' : 'text-bosque'
                  }`}
                >
                  {l.label}
                  <Icon name="arrow-right" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
