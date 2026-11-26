"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, X, ChefHat, Sparkles } from "lucide-react";
import type { IngredientMatchRecipe } from "@/types/recipe";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeGridSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/PageLoader";

function IngredientsContent() {
  const searchParams = useSearchParams();
  const initialItems = (searchParams.get("items") || "").split(",").map((i) => i.trim()).filter(Boolean);
  const [value, setValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(initialItems);
  const [recipes, setRecipes] = useState<IngredientMatchRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const autoSearched = useRef(false);

  const addIngredient = (raw: string) => {
    const next = raw.trim().replace(/\s+/g, " ");
    if (!next) return;
    if (ingredients.some((i) => i.toLowerCase() === next.toLowerCase())) { setValue(""); return; }
    setIngredients((prev) => [...prev, next]);
    setValue("");
  };

  const removeIngredient = (name: string) => setIngredients((prev) => prev.filter((i) => i !== name));

  const search = async (items: string[] = ingredients) => {
    if (items.length === 0) { setError("Add at least one ingredient to search."); return; }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(`/api/ingredients?items=${encodeURIComponent(items.join(","))}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to search recipes");
      setRecipes(data.recipes || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoSearched.current && initialItems.length > 0) {
      autoSearched.current = true;
      void search(initialItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mostMatches = recipes.filter((r) => r.matchCount === r.totalRequested && r.totalRequested > 0);
  const someMatches = recipes.filter((r) => r.matchCount !== r.totalRequested || r.totalRequested === 0);

  return (
    <main className="container-shell section-pad">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Find by ingredients</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Cook with what you have</h1>
        <p className="mt-4 text-base leading-7 text-muted">Add the ingredients in your kitchen and we&apos;ll find recipes that match. We&apos;ll show which of your ingredients appear in each recipe.</p>
      </div>

      <div className="mt-10 card-surface rounded-4xl p-6 sm:p-7">
        <label htmlFor="ingredient-input" className="block text-sm font-medium text-foreground">Add ingredients</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="ingredient-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIngredient(value); } }}
              placeholder="Type an ingredient and press Enter"
              className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <button type="button" onClick={() => addIngredient(value)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
          {ingredients.map((ingredient) => (
            <span key={ingredient} className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground">
              {ingredient}
              <button type="button" onClick={() => removeIngredient(ingredient)} className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground" aria-label={`Remove ${ingredient}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => void search()} className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-deep">
            Find Matching Recipes
          </button>
          <button type="button" onClick={() => { setIngredients([]); setRecipes([]); setError(""); setSearched(false); setValue(""); }} className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-muted transition hover:bg-surface-muted hover:text-foreground">
            Clear all
          </button>
        </div>
      </div>

      {error ? <div className="mt-8 rounded-2xl border border-red-300/40 bg-red-50 px-5 py-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}

      <div className="mt-10 space-y-12">
        {loading ? (
          <RecipeGridSkeleton count={8} />
        ) : searched && recipes.length === 0 && !error ? (
          <EmptyState icon={ChefHat} title="No matching recipes found" description="Try different ingredients or fewer items. We search TheMealDB and rank recipes by how many of your ingredients they include." />
        ) : recipes.length > 0 ? (
          <>
            {mostMatches.length > 0 ? (
              <section>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary"><Sparkles className="h-5 w-5" /></span>
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-foreground">Matches all your ingredients</h2>
                    <p className="text-sm text-muted">These recipes include every ingredient you entered (verified from recipe details).</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {mostMatches.map((recipe) => (
                    <div key={recipe.id} className="space-y-3">
                      <RecipeCard recipe={recipe} />
                      <p className="px-1 text-xs font-medium text-primary">Matches {recipe.matchCount}/{recipe.totalRequested}: {recipe.matchedIngredients.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {someMatches.length > 0 ? (
              <section>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent"><ChefHat className="h-5 w-5" /></span>
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-foreground">Matches some ingredients</h2>
                    <p className="text-sm text-muted">These recipes include some of your ingredients. Missing items can be added to your shopping list from the recipe page.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {someMatches.map((recipe) => (
                    <div key={recipe.id} className="space-y-3">
                      <RecipeCard recipe={recipe} />
                      <p className="px-1 text-xs font-medium text-muted">Matches {recipe.matchCount}/{recipe.totalRequested}: {recipe.matchedIngredients.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}

export default function IngredientsPage() {
  return (
    <Suspense fallback={<main><PageLoader label="Loading your ingredient search." /></main>}>
      <IngredientsContent />
    </Suspense>
  );
}
