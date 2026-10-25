import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';

export default function Footer() {
  const categorias = useProductStore((s) => s.categorias);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const columnas = [
    {
      titulo: 'Tienda',
      links: [
        ...categorias.map((c) => ({ to: `/productos?categoriaId=${c.id}`, label: c.nombre })),
        { to: '/productos?descuento=1', label: 'Ofertas' },
      ],
    },
    {
      titulo: 'Ayuda',
      links: [
        { to: '/contacto', label: 'Contacto' },
        { to: '/carrito', label: 'Carrito' },
      ],
    },
    {
      titulo: 'Cuenta',
      links: isAuthenticated
        ? [{ to: '/perfil', label: 'Mis pedidos' }]
        : [
            { to: '/login', label: 'Ingresar' },
            { to: '/perfil', label: 'Mis pedidos' },
          ],
    },
  ];

  return (
    <footer className="bg-white border-t border-borde mt-16 md:mt-24">
      <div className="container-app flex flex-col md:flex-row md:justify-between gap-10 py-10 md:py-12">
        <div className="flex flex-col gap-3 max-w-[320px]">
          <p className="font-display text-[22px] leading-none text-bosque">DEPORSHOP</p>
          <p className="text-body-sm leading-[1.6] text-musgo">Equipamiento deportivo para moverte todos los días.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-8 md:gap-16">
          {columnas.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo} className="flex flex-col gap-2.5">
              <p className="text-label-sm font-bold uppercase tracking-[0.78px] text-bosque">{col.titulo}</p>
              {col.links.map((l) => (
                <Link key={l.to + l.label} to={l.to} className="text-body-sm text-bosque hover:text-esmeralda transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="container-app">
        <p className="border-t border-borde py-5 text-label-sm font-normal text-musgo">
          &copy; {new Date().getFullYear()} DeporShop
        </p>
      </div>
    </footer>
  );
}
