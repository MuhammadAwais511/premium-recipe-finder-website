"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { RecipeSummary } from "@/types/recipe";
import { useFavorites } from "@/lib/storage/use-favorites";
import { useToast } from "@/components/ui/ToastProvider";

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const favorite = isFavorite(recipe.id);

  return (
    <motion.article
      className="card-surface group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-shadow duration-300 hover:shadow-[0_24px_54px_rgba(36,45,38,0.14)]"
      whileHover={shouldReduceMotion ? undefined : { y: -5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={800}
          height={600}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur dark:bg-black/45 dark:text-white">
            {recipe.category || "Recipe"}
          </span>
          <button
            type="button"
            aria-label={favorite ? `Remove ${recipe.name} from favorites` : `Save ${recipe.name} to favorites`}
            aria-pressed={favorite}
            onClick={() => {
              const saved = toggleFavorite({
                id: recipe.id,
                name: recipe.name,
                image: recipe.image,
                category: recipe.category,
                area: recipe.area,
              });
              showToast(saved ? "Saved to favorites" : "Removed from favorites", "success");
            }}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition ${
              favorite
                ? "bg-accent text-white"
                : "bg-white/92 text-foreground hover:bg-white hover:text-accent dark:bg-black/45 dark:text-white dark:hover:bg-black/60"
            }`}
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{recipe.area ? `${recipe.area} cuisine` : recipe.category ? `${recipe.category} recipe` : "Delicious recipe"}</span>
          {recipe.prepLabel ? <span className="text-border">•</span> : null}
          {recipe.prepLabel ? <span>{recipe.prepLabel}</span> : null}
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
          {recipe.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted line-clamp-3">{recipe.description || "Discover the full recipe details, ingredients, and cooking steps."}</p>

        <div className="mt-6 flex items-center justify-between gap-4 pt-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {recipe.ingredients?.length ? `${recipe.ingredients.length} ingredients` : "View details"}
          </p>
          <Link
            href={`/recipe/${recipe.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-deep"
          >
            View Recipe
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
