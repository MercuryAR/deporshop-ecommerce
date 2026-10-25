import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { useProductStore } from '../store/productStore';

export default function Products() {
  const [searchParams] = useSearchParams();
  const setFiltro = useProductStore((s) => s.setFiltro);

  // Los links del header/footer llevan los filtros en la URL; al navegar se aplican
  // y los que no vienen vuelven a su valor por defecto.
  useEffect(() => {
    const categoriaId = searchParams.get('categoriaId');
    setFiltro('categoriaId', categoriaId ? Number(categoriaId) : 'all');
    setFiltro('buscar', searchParams.get('buscar') ?? '');
    setFiltro('soloConDescuento', searchParams.get('descuento') === '1');
  }, [searchParams, setFiltro]);

  return (
    <div>
      <section className="container-app pt-10 md:pt-14 pb-6">
        <p className="section-overline mb-3">Tienda</p>
        <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mb-3">PRODUCTOS</h1>
        <p className="text-body text-musgo max-w-xl">
          Descubrí nuestra colección completa de zapatillas, ropa y accesorios deportivos.
        </p>
      </section>

      <section className="container-app">
        <ProductList />
      </section>
    </div>
  );
}
