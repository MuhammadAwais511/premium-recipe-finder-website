"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import type { RecipeDetail } from "@/types/recipe";

export function RandomRecipeSection({ initialRecipe }: { initialRecipe: { id: string; name: string; image: string; description: string; category?: string; area?: string } }) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [loading, setLoading] = useState(false);

  const shuffle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes?random=true", { cache: "no-store" });
      const data = await res.json();
      if (data.recipe) {
        const r: RecipeDetail = data.recipe;
        setRecipe({
          id: r.id,
          name: r.name,
          image: r.image,
          category: r.category,
          area: r.area,
          description: r.instructions[0]?.slice(0, 160) || "A delicious recipe to try.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card-surface overflow-hidden rounded-[2rem]">
      <div className="grid h-full md:grid-cols-[0.95fr_1.05fr]">
        <Image src={recipe.image} alt={recipe.name} width={900} height={900} className="h-full min-h-[280px] w-full object-cover" />
        <div className="p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Random recipe
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">Need inspiration?</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Let a surprise pick spark your next meal. Here&apos;s one to try: <span className="font-semibold text-foreground">{recipe.name}</span>.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted line-clamp-3">{recipe.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/recipe/${recipe.id}`} className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-deep">
              View Recipe
            </Link>
            <button type="button" onClick={shuffle} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Surprise me
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
