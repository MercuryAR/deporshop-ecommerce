import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { useProductStore } from '../store/productStore';

export default function Products() {
  const [searchParams] = useSearchParams();
  const setFiltro = useProductStore((s) => s.setFiltro);

  useEffect(() => {
    const categoriaId = searchParams.get('categoriaId');
    const buscar = searchParams.get('buscar');
    if (categoriaId) setFiltro('categoriaId', Number(categoriaId));
    if (buscar) setFiltro('buscar', buscar);
    if (searchParams.get('descuento') === '1') setFiltro('soloConDescuento', true);
  }, [searchParams, setFiltro]);

  return (
    <div>
      <section className="container-app pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Productos</h1>
        <p className="text-gray-500 max-w-xl">
          Descubre nuestra colección completa de zapatillas y accesorios deportivos
        </p>
      </section>

      <section className="container-app pb-16">
        <ProductList />
      </section>
    </div>
  );
}
