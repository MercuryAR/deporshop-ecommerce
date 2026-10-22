export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse" aria-hidden="true">
      <div className="aspect-square bg-gray-100" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-gray-100 rounded" />
        <div className="h-5 w-4/5 bg-gray-100 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
          <div className="h-6 w-24 bg-gray-100 rounded" />
          <div className="h-9 w-24 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Cargando productos">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
