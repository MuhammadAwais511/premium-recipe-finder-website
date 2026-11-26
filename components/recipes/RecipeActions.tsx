"use client";

import { useState } from "react";
import { Heart, ShoppingBag, ExternalLink, PlayCircle } from "lucide-react";
import type { RecipeDetail, RecipeSummary } from "@/types/recipe";
import { useFavorites } from "@/lib/storage/use-favorites";
import { addShoppingItems } from "@/lib/storage/shopping-list";
import { useToast } from "@/components/ui/ToastProvider";

export function RecipeActions({ recipe }: { recipe: RecipeDetail }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<string[]>(recipe.ingredients.map((i) => i.ingredient));
  const favorite = isFavorite(recipe.id);

  const recipeSummary: RecipeSummary = {
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    category: recipe.category,
    area: recipe.area,
  };

  const toggleIngredient = (name: string) => {
    setSelected((prev) => prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]);
  };

  return (
    <aside className="card-surface rounded-[2rem] p-6 lg:sticky lg:top-28">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Recipe actions</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Make it yours</h2>

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            const saved = toggleFavorite(recipeSummary);
            showToast(saved ? "Saved to favorites" : "Removed from favorites", "success");
          }}
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition ${
            favorite ? "bg-accent text-white hover:bg-accent/90" : "bg-primary text-white hover:bg-primary-deep"
          }`}
        >
          <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} aria-hidden="true" />
          {favorite ? "Saved to Favorites" : "Save to Favorites"}
        </button>

        {recipe.source ? (
          <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Source
          </a>
        ) : null}
        {recipe.youtube ? (
          <a href={recipe.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
            <PlayCircle className="h-4 w-4" aria-hidden="true" /> Watch Tutorial
          </a>
        ) : null}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Add to shopping list</h3>
          <button
            type="button"
            className="text-xs font-semibold text-primary hover:text-primary-deep"
            onClick={() => setSelected(selected.length === recipe.ingredients.length ? [] : recipe.ingredients.map((i) => i.ingredient))}
          >
            {selected.length === recipe.ingredients.length ? "Clear" : "Select all"}
          </button>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted">Select ingredients you need to buy.</p>
        <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
          {recipe.ingredients.map((item) => {
            const checked = selected.includes(item.ingredient);
            return (
              <label key={item.ingredient} className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-1.5 text-sm hover:bg-surface-muted/70">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleIngredient(item.ingredient)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary accent-primary"
                />
                <span>
                  <span className="font-medium text-foreground">{item.ingredient}</span>
                  {item.measure ? <span className="text-muted"> — {item.measure}</span> : null}
                </span>
              </label>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            if (selected.length === 0) {
              showToast("Select at least one ingredient", "info");
              return;
            }
            addShoppingItems(selected);
            showToast(`Added ${selected.length} item${selected.length > 1 ? "s" : ""} to shopping list`, "success");
          }}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add Selected Ingredients
        </button>
      </div>
    </aside>
  );
}
