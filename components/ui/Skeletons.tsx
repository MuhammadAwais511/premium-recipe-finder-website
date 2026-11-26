export function RecipeCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden rounded-[1.75rem]">
      <div className="h-60 animate-pulse bg-surface-muted" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-28 animate-pulse rounded bg-surface-muted" />
        <div className="h-7 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-muted" />
        <div className="flex justify-between pt-2">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
