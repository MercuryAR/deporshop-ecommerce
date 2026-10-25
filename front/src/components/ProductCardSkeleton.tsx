export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2 bg-white rounded-md animate-pulse" aria-hidden="true">
      <div className="aspect-[264/248] rounded-sm bg-aire" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 w-1/3 bg-menta rounded-pill" />
        <div className="h-5 w-4/5 bg-menta rounded-pill" />
        <div className="h-3 w-1/2 bg-menta rounded-pill" />
        <div className="flex justify-between items-end pt-2">
          <div className="h-6 w-24 bg-menta rounded-pill" />
          <div className="size-10 bg-menta rounded-pill" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Cargando productos">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
