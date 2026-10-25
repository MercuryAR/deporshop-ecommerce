import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton';
import BenefitCard from '../components/BenefitCard';
import CategoryCard, { type CategoryColor } from '../components/CategoryCard';
import PromoBanner from '../components/PromoBanner';
import Icon, { type IconName } from '../components/Icons';
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

const BENEFITS: { icon: IconName; titulo: string; descripcion: string }[] = [
  { icon: 'truck', titulo: 'Envío gratis', descripcion: `En compras desde ${formatearPrecio(ENVIO_GRATIS_DESDE)}` },
  { icon: 'rotate', titulo: 'Cambios y devoluciones', descripcion: 'Sin cargo durante 30 días' },
  { icon: 'shield', titulo: 'Pago seguro', descripcion: 'Tus datos siempre protegidos' },
  { icon: 'award', titulo: 'Calidad garantizada', descripcion: 'Productos originales' },
];

const CATEGORY_COLORS: CategoryColor[] = ['menta', 'esmeralda', 'lima'];

export default function Home() {
  const { productos, categorias, loading, error, fetchProductos } = useProductStore();

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const destacados = productos.slice(0, 8);
  const maxDescuento = Math.round(Math.max(0, ...productos.map((p) => p.descuento)));

  return (
    <div>
      <section className="bg-bosque text-white overflow-hidden">
        <div className="container-app grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 md:py-20">
          <div>
            <span className="inline-block section-overline text-lima border border-white/20 rounded-pill px-3 py-1.5 mb-6">
              Nueva temporada
            </span>
            <h1 className="font-display text-[52px] leading-[0.92] tracking-[-1px] sm:text-display-l lg:text-[80px] xl:text-display-xl mb-6">
              MOVETE <br />
              <span className="text-lima">MEJOR.</span>
            </h1>
            <p className="text-body-lg text-menta max-w-md mb-8">
              Zapatillas, ropa y accesorios pensados para entrenar. Con envío a todo el país.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/productos" className="btn-lima btn-lg">
                Ver productos <Icon name="arrow-right" size={20} />
              </Link>
              <Link to="/productos?descuento=1" className="btn btn-lg text-white border-[1.5px] border-white/40 hover:bg-white/10">
                Ofertas
              </Link>
            </div>
          </div>

          <Carousel slides={FEATURED_SLIDES} />
        </div>
      </section>

      <section className="container-app grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 md:py-10">
        {BENEFITS.map((b) => (
          <BenefitCard key={b.titulo} {...b} />
        ))}
      </section>

      {categorias.length > 0 && (
        <section className="container-app py-8 md:py-12">
          <p className="section-overline mb-3">Categorías</p>
          <h2 className="font-display text-[28px] leading-[1.05] tracking-[-0.5px] sm:text-h2 lg:text-h1 mb-8">ELEGÍ TU DEPORTE</h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((c, i) => (
              <CategoryCard
                key={c.id}
                to={`/productos?categoriaId=${c.id}`}
                categoria={c.nombre}
                cantidad={productos.filter((p) => p.categoria?.id === c.id).length}
                color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
              />
            ))}
          </div>
        </section>
      )}

      <section className="container-app py-8 md:py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="section-overline mb-3">Los favoritos</p>
            <h2 className="font-display text-[28px] leading-[1.05] tracking-[-0.5px] sm:text-h2 lg:text-h1">DESTACADOS</h2>
          </div>
          <Link to="/productos" className="btn-text hidden sm:inline-flex">
            Ver todo <Icon name="arrow-right" size={18} />
          </Link>
        </div>

        {error && destacados.length === 0 ? (
          <p className="text-center text-musgo py-10">No pudimos cargar los productos. Intentá de nuevo más tarde.</p>
        ) : loading && destacados.length === 0 ? (
          <ProductGridSkeleton />
        ) : destacados.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destacados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-center text-musgo py-10">Todavía no hay productos destacados.</p>
        )}

        <div className="text-center mt-10">
          <Link to="/productos" className="btn-primary">
            Ver todos los productos <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </section>

      <section className="container-app py-8 md:py-12">
        <PromoBanner descuento={maxDescuento || 15} />
      </section>
    </div>
  );
}
