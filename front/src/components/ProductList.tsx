import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from './ProductCardSkeleton';
import Icon from './Icons';

interface ProductListProps {
  showFilters?: boolean;
}

export default function ProductList({ showFilters = true }: ProductListProps) {
  const {
    categorias,
    filtros,
    loading,
    error,
    fetchProductos,
    fetchCategorias,
    setFiltro,
    resetFiltros,
    getProductosFiltrados,
  } = useProductStore();

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);

  const productos = getProductosFiltrados();

  return (
    <div>
      {showFilters && (
        <div className="card p-4 sm:p-6 mb-8 flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-[1fr_240px] items-end">
            <div>
              <label htmlFor="buscar" className="form-label">
                Buscar
              </label>
              <div className="relative">
                <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-bosque pointer-events-none" />
                <input
                  id="buscar"
                  type="search"
                  className="form-input pl-10 focus:pl-10 bg-menta rounded-pill"
                  placeholder="Buscar productos"
                  value={filtros.buscar}
                  onChange={(e) => setFiltro('buscar', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="ordenar" className="form-label">
                Ordenar por
              </label>
              <select
                id="ordenar"
                className="form-select"
                value={filtros.ordenar}
                onChange={(e) => setFiltro('ordenar', e.target.value as typeof filtros.ordenar)}
              >
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre</option>
                <option value="rating">Mejor calificados</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
              <button
                type="button"
                className={filtros.categoriaId === 'all' ? 'chip-active' : 'chip'}
                aria-pressed={filtros.categoriaId === 'all'}
                onClick={() => setFiltro('categoriaId', 'all')}
              >
                Todas
              </button>
              {categorias.map((cat) => {
                const activa = filtros.categoriaId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={activa ? 'chip-active' : 'chip'}
                    aria-pressed={activa}
                    onClick={() => setFiltro('categoriaId', activa ? 'all' : cat.id)}
                  >
                    {cat.nombre}
                    {activa && <Icon name="x" size={14} />}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <label className="flex items-center gap-2.5 text-body-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={filtros.soloEnStock}
                  onChange={(e) => setFiltro('soloEnStock', e.target.checked)}
                />
                Solo en stock
              </label>
              <label className="flex items-center gap-2.5 text-body-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={filtros.soloConDescuento}
                  onChange={(e) => setFiltro('soloConDescuento', e.target.checked)}
                />
                Con descuento
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-borde">
            <p className="text-body-sm text-musgo">
              {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado
              {productos.length !== 1 ? 's' : ''}
            </p>
            <button type="button" className="btn-text btn-sm" onClick={resetFiltros}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {loading && <ProductGridSkeleton />}

      {error && (
        <div className="text-center py-16">
          <p className="text-error font-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && productos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-body-lg text-musgo mb-6">No hay productos que coincidan con tus filtros</p>
          <button type="button" className="btn-primary" onClick={resetFiltros}>
            Limpiar filtros
          </button>
        </div>
      )}

      {!loading && !error && productos.length > 0 && (
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
