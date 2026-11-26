"use client";

import Link from "next/link";
import { ArrowRight, Flame, Heart } from "lucide-react";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useEffect, useState } from "react";
import type { RecipeSummary } from "@/types/recipe";
import { getRecentlyViewed } from "@/lib/storage/recently-viewed";

export function RecentlyViewedSection() {
  const [items, setItems] = useState<RecipeSummary[]>([]);

  useEffect(() => {
    queueMicrotask(() => setItems(getRecentlyViewed()));
    const onStorage = () => setItems(getRecentlyViewed());
    window.addEventListener("wmk-storage", onStorage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("wmk-storage", onStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <article className="card-surface rounded-[2rem] p-8">
      <p className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        <Heart className="h-3.5 w-3.5" aria-hidden="true" />
        Recently viewed
      </p>
      <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">Pick up where you left off</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
        Recipes you explore will appear here so you can quickly return to them.
      </p>
      {items.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {items.slice(0, 2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-background/70 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-primary">
            <Flame className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-4 font-semibold text-foreground">No recently viewed recipes yet</p>
          <p className="mt-2 text-sm leading-6 text-muted">Start exploring recipes and your latest finds will show up here.</p>
          <Link href="/discover" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">
            Start exploring <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </article>
  );
}
