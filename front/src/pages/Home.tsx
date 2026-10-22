import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton';
import { ArrowRightIcon, BadgeCheckIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons';
import { useProductStore } from '../store/productStore';
import { ENVIO_GRATIS_DESDE } from '../store/cartStore';
import { formatearPrecio } from '../services/api';
import type { CarouselSlide } from '../components/Carousel';

const FEATURED_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: '/img/zapatillahombre1.jpeg',
    title: 'Nueva colección',
    subtitle: 'Zapatillas deportivas de alto rendimiento',
  },
  {
    id: 2,
    image: '/img/zapatillahombre3.jpeg',
    title: 'Estilo urbano',
    subtitle: 'Comodidad y diseño para el día a día',
  },
  {
    id: 3,
    image: '/img/zapatillahombre5.jpeg',
    title: 'Rendimiento deportivo',
    subtitle: 'Pensadas para el entrenamiento exigente',
  },
  {
    id: 4,
    image: '/img/zapatillahombre7.jpeg',
    title: 'Ofertas especiales',
    subtitle: 'Descuentos por tiempo limitado',
  },
];

const BENEFITS = [
  { icon: TruckIcon, title: 'Envío gratis', text: `En compras superiores a ${formatearPrecio(ENVIO_GRATIS_DESDE)}` },
  { icon: ReturnIcon, title: 'Devoluciones fáciles', text: '30 días para cambios y devoluciones' },
  { icon: ShieldIcon, title: 'Compra segura', text: 'Tus datos siempre protegidos' },
  { icon: BadgeCheckIcon, title: 'Calidad garantizada', text: 'Productos seleccionados y verificados' },
];

export default function Home() {
  const { productos, loading, error, fetchProductos, fetchCategorias } = useProductStore();

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);

  const destacados = productos.slice(0, 8);

  return (
    <div>
      <section className="bg-primary text-white overflow-hidden">
        <div className="container-app grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 md:py-20">
          <div>
            <p className="inline-block text-xs font-semibold uppercase tracking-widest text-accent-light bg-white/10 rounded-full px-3 py-1 mb-5">
              Nueva temporada
            </p>
            <h1 className="font-display italic uppercase font-extrabold text-5xl md:text-7xl leading-[0.95] tracking-tight mb-5">
              Encuentra tu <span className="text-accent">próximo par</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md mb-8">
              Zapatillas y accesorios deportivos de calidad al mejor precio, con envío a todo el país.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/productos" className="btn-accent px-6 py-3">
                Ver productos <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/productos?descuento=1"
                className="btn bg-white/10 text-white hover:bg-white/20 px-6 py-3"
              >
                Ofertas
              </Link>
            </div>
          </div>

          <Carousel slides={FEATURED_SLIDES} />
        </div>
      </section>

      <section className="border-b border-gray-200">
        <div className="container-app grid sm:grid-cols-2 lg:grid-cols-4 gap-5 py-8">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
                <Icon />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-app">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Productos destacados</h2>
              <p className="text-gray-500">Los favoritos de nuestros clientes</p>
            </div>
            <Link
              to="/productos"
              className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent transition-colors"
            >
              Ver todo <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {error && destacados.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No pudimos cargar los productos. Intenta de nuevo más tarde.</p>
          ) : loading && destacados.length === 0 ? (
            <ProductGridSkeleton />
          ) : destacados.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">Todavía no hay productos destacados.</p>
          )}

          <div className="text-center mt-10">
            <Link to="/productos" className="btn-primary">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
