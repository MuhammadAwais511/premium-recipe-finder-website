"use client";

import { useMemo, useState } from "react";
import { Heart, Search } from "lucide-react";
import { useFavorites } from "@/lib/storage/use-favorites";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((r) => r.name.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q) || r.area?.toLowerCase().includes(q));
  }, [favorites, query]);

  return (
    <main className="container-shell section-pad">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Favorites</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Your saved recipes</h1>
        <p className="mt-4 text-base leading-7 text-muted">Keep the recipes you love close by and come back whenever you&apos;re ready to cook.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="mt-8 card-surface rounded-4xl p-5 sm:p-6">
          <label className="block max-w-md">
            <span className="mb-2 block text-sm font-medium text-foreground">Search favorites</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search saved recipes..." className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </div>
          </label>
        </div>
      ) : null}

      <div className="mt-10">
        {favorites.length === 0 ? (
          <EmptyState icon={Heart} title="No favorites yet" description="Save recipes you love and they’ll appear here for quick access anytime." actionLabel="Discover recipes" actionHref="/discover" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Search} title="No matching favorites" description="Try a different search term to find a saved recipe." actionLabel="Clear search" onAction={() => setQuery("")} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
          </div>
        )}
      </div>
    </main>
  );
}
