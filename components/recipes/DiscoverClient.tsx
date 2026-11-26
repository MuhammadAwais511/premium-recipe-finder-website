"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { RecipeSummary } from "@/types/recipe";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeGridSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchX } from "lucide-react";

interface Props {
  initialRecipes: RecipeSummary[];
  categories: string[];
  areas: string[];
  initialCategory?: string;
  initialArea?: string;
  initialQuery?: string;
}

export function DiscoverClient({
  initialRecipes,
  categories,
  areas,
  initialCategory = "",
  initialArea = "",
  initialQuery = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [area, setArea] = useState(initialArea);
  const [sort, setSort] = useState("name");
  const [recipes, setRecipes] = useState<RecipeSummary[]>(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(12);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        let list: RecipeSummary[] = [];
        if (debouncedQuery) {
          const res = await fetch(
            `/api/recipes?q=${encodeURIComponent(debouncedQuery)}`,
          );
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to search recipes");
          list = data.recipes || [];
        } else if (category) {
          const res = await fetch(
            `/api/recipes?category=${encodeURIComponent(category)}`,
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to load category");
          list = data.recipes || [];
        } else if (area) {
          const res = await fetch(
            `/api/recipes?area=${encodeURIComponent(area)}`,
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to load cuisine");
          list = data.recipes || [];
        } else {
          list = initialRecipes;
        }

        if (category && !debouncedQuery) {
          list = list.filter(
            (r) =>
              !r.category ||
              r.category.toLowerCase() === category.toLowerCase(),
          );
        }
        if (area && !debouncedQuery) {
          list = list.filter(
            (r) => !r.area || r.area.toLowerCase() === area.toLowerCase(),
          );
        }
        if (category && debouncedQuery) {
          list = list.filter(
            (r) => r.category?.toLowerCase() === category.toLowerCase(),
          );
        }
        if (area && debouncedQuery) {
          list = list.filter(
            (r) => r.area?.toLowerCase() === area.toLowerCase(),
          );
        }

        if (!ignore) {
          setRecipes(list);
          setVisible(12);
        }
      } catch (e) {
        if (!ignore)
          setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [debouncedQuery, category, area, initialRecipes]);

  const sorted = useMemo(() => {
    const copy = [...recipes];
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "category")
      copy.sort(
        (a, b) =>
          (a.category || "").localeCompare(b.category || "") ||
          a.name.localeCompare(b.name),
      );
    return copy;
  }, [recipes, sort]);

  const shown = sorted.slice(0, visible);

  return (
    <div className="space-y-8">
      <div className="card-surface rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Search by name
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes..."
                className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Cuisine
            </span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-12 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="">All cuisines</option>

              {[...new Set(areas)].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Sort
            </span>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="name">Name (A–Z)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </label>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-300/40 bg-red-50 px-5 py-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <RecipeGridSkeleton count={8} />
      ) : shown.length > 0 ? (
        <>
          <div className="flex items-center justify-between text-sm text-muted">
            <p>
              Showing {shown.length} of {sorted.length} recipes
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {shown.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {visible < sorted.length ? (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 12)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-surface px-8 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Load more
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No recipes found"
          description="Try adjusting your search, category, or cuisine filters to find something delicious."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery("");
            setCategory("");
            setArea("");
          }}
        />
      )}
    </div>
  );
}
