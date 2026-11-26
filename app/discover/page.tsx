import type { Metadata } from "next";
import { Suspense } from "react";
import { getAreas, getCategoryList, getRecipesByArea, getRecipesByCategory, searchRecipesByName } from "@/lib/api/mealdb";
import { DiscoverClient } from "@/components/recipes/DiscoverClient";
import { PageLoader } from "@/components/ui/PageLoader";

export const metadata: Metadata = {
  title: "Discover Recipes",
  description: "Search and explore recipes by name, category, and cuisine.",
};

async function DiscoverContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; area?: string; q?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params.category || "";
  const initialArea = params.area || "";
  const initialQuery = params.q || "";
  const [initialRecipes, categories, areas] = await Promise.all([
    initialQuery
      ? searchRecipesByName(initialQuery).catch(() => [])
      : initialCategory
        ? getRecipesByCategory(initialCategory).catch(() => [])
        : initialArea
          ? getRecipesByArea(initialArea).catch(() => [])
          : searchRecipesByName("").catch(() => []),
    getCategoryList().catch(() => []),
    getAreas().catch(() => []),
  ]);

  return (
    <DiscoverClient
      initialRecipes={initialRecipes.slice(0, 24)}
      categories={categories}
      areas={areas}
      initialCategory={initialCategory}
      initialArea={initialArea}
      initialQuery={initialQuery}
    />
  );
}

export default function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; area?: string; q?: string }>;
}) {
  return (
    <main className="container-shell section-pad">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Discover</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Find your next favorite meal</h1>
        <p className="mt-4 text-base leading-7 text-muted">Search recipes by name, explore categories, and filter by cuisine to discover something delicious.</p>
      </div>
      <div className="mt-10">
        <Suspense fallback={<PageLoader label="Loading recipes and filters." className="min-h-[28rem]" />}>
          <DiscoverContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
