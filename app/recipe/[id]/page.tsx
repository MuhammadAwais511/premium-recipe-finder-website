import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Globe2, Tag, Utensils } from "lucide-react";
import { getRecipeById, getRecipesByCategory } from "@/lib/api/mealdb";
import { RecipeActions } from "@/components/recipes/RecipeActions";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecentlyViewedRecorder } from "@/components/recipes/RecentlyViewedRecorder";
import { PageLoader } from "@/components/ui/PageLoader";

async function RecipeContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) notFound();

  const related = (await getRecipesByCategory(recipe.category))
    .filter((item) => item.id !== recipe.id)
    .slice(0, 4);

  const summary = { id: recipe.id, name: recipe.name, image: recipe.image, category: recipe.category, area: recipe.area };

  return (
    <main>
      <RecentlyViewedRecorder recipe={summary} />
      <section className="border-b border-border/70 bg-surface/40">
        <div className="container-shell py-10 lg:py-14">
          <Link href="/discover" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to recipes
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative overflow-hidden rounded-4xl card-surface">
              <Image src={recipe.image} alt={recipe.name} width={1200} height={900} priority className="h-full min-h-90 w-full object-cover sm:min-h-120" />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground">{recipe.category}</span>
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground">{recipe.area}</span>
                {recipe.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">{tag}</span>
                ))}
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">{recipe.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                {recipe.instructions[0]?.slice(0, 220) || "A delicious recipe with simple ingredients and clear steps."}
                {recipe.instructions[0] && recipe.instructions[0].length > 220 ? "…" : ""}
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-surface p-4 border border-border/70">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted"><Utensils className="h-4 w-4 text-primary" /> Ingredients</dt>
                  <dd className="mt-2 text-lg font-semibold text-foreground">{recipe.ingredients.length}</dd>
                </div>
                <div className="rounded-3xl bg-surface p-4 border border-border/70">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted"><Globe2 className="h-4 w-4 text-primary" /> Cuisine</dt>
                  <dd className="mt-2 text-lg font-semibold text-foreground">{recipe.area}</dd>
                </div>
                <div className="rounded-3xl bg-surface p-4 border border-border/70">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted"><Tag className="h-4 w-4 text-primary" /> Category</dt>
                  <dd className="mt-2 text-lg font-semibold text-foreground">{recipe.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <div className="card-surface rounded-4xl p-7 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Ingredients</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">What you&apos;ll need</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {recipe.ingredients.map((item) => (
                  <li key={`${item.ingredient}-${item.measure}`} className="flex items-start gap-3 rounded-2xl bg-surface-muted/60 px-4 py-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm leading-6 text-foreground">
                      <span className="font-medium">{item.ingredient}</span>
                      {item.measure ? <span className="text-muted"> — {item.measure}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface rounded-4xl p-7 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Instructions</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">How to make it</h2>
              <ol className="mt-6 space-y-5">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-7 text-muted sm:text-base">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <RecipeActions recipe={recipe} />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-pad bg-surface/50 border-t border-border/70">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Related recipes</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-foreground">More {recipe.category} ideas</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <RecipeCard key={item.id} recipe={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default function RecipeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main><PageLoader label="Loading recipe details." /></main>}>
      <RecipeContent params={params} />
    </Suspense>
  );
}
