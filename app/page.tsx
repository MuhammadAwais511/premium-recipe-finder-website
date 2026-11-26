import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Compass, ShoppingBasket, Sparkles, UtensilsCrossed } from "lucide-react";
import { IngredientSearchHero } from "@/components/home/IngredientSearchHero";
import { RandomRecipeSection } from "@/components/home/RandomRecipeSection";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { MotionSection } from "@/components/ui/MotionSection";
import { getCategories, getRecipesByCategory, searchRecipesByName } from "@/lib/api/mealdb";
import { featuredRecipe as mockFeatured, mockCategories, mockCuisines, popularRecipes as mockPopular, quickEasyRecipes as mockQuick } from "@/lib/data/mock-recipes";

const valueProps = [
  { icon: UtensilsCrossed, title: "Cook with what you have", description: "Add the ingredients in your kitchen and discover recipes that make sense for today." },
  { icon: Compass, title: "Explore new flavors", description: "Browse cuisines, categories, and chef-worthy ideas without the clutter." },
  { icon: ShoppingBasket, title: "Plan smarter", description: "Save favorites and build a shopping list so your next meal is always within reach." },
];

export default async function Home() {
  const [allRecipes, categories, vegetarian] = await Promise.all([
    searchRecipesByName("").catch(() => []),
    getCategories().catch(() => []),
    getRecipesByCategory("Vegetarian").catch(() => []),
  ]);

  const popularRecipes = allRecipes.length >= 4 ? allRecipes.slice(0, 4) : mockPopular;
  const quickEasyRecipes = vegetarian.length >= 4 ? vegetarian.slice(0, 4) : mockQuick;
  const featured = allRecipes[4] || allRecipes[0] || mockFeatured;
  const displayCategories = categories.length > 0 ? categories.slice(0, 6) : mockCategories;
  const randomSource = allRecipes[6] || allRecipes[2] || mockPopular[2];
  const randomRecipe = {
    id: randomSource.id,
    name: randomSource.name,
    image: randomSource.image,
    category: randomSource.category,
    area: randomSource.area,
    description: randomSource.description || "A delicious recipe to try when you need inspiration.",
  };

  return (
    <main>
      <MotionSection className="relative isolate overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(215,120,69,0.14),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(53,102,74,0.12),_transparent_28%)]" />
        <div className="container-shell relative grid gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-surface/90 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              A little inspiration for every meal
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
              Make something <span className="text-primary">wonderful</span> with what you have.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Find a recipe for tonight, discover flavors worth sharing, and make the most of what&apos;s already in your kitchen.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/discover" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(53,102,74,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-deep">
                Discover Recipes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/ingredients" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-surface/80 px-6 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary">
                Find by Ingredients
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {valueProps.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-border/70 bg-surface/75 p-4 shadow-sm backdrop-blur">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-3 text-sm font-semibold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden h-28 w-28 rounded-full bg-accent/15 blur-2xl lg:block" />
            <div className="absolute -bottom-8 right-0 hidden h-36 w-36 rounded-full bg-primary/15 blur-3xl lg:block" />
            <div className="relative space-y-5 lg:pl-3">
              <div className="card-surface group relative overflow-hidden rounded-[2rem]">
                <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80" alt="A beautifully plated meal on a dining table" width={1400} height={1000} priority className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-[1.025] sm:h-[390px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                  <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                  Made for your everyday table
                </div>
              </div>
              <IngredientSearchHero />
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-pad">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] card-surface">
            <Image src={featured.image} alt={featured.name} width={1200} height={900} className="h-full min-h-[360px] w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Featured recipe</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">A dish worth making tonight</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{featured.description || "A delicious recipe selected to inspire your next meal, with familiar ingredients and a satisfying home-cooked feel."}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-surface-muted p-4"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Category</dt><dd className="mt-2 text-base font-semibold text-foreground">{featured.category || "Recipe"}</dd></div>
              <div className="rounded-3xl bg-surface-muted p-4"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Cuisine</dt><dd className="mt-2 text-base font-semibold text-foreground">{featured.area || "International"}</dd></div>
              <div className="rounded-3xl bg-surface-muted p-4"><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Mood</dt><dd className="mt-2 text-base font-semibold text-foreground">{featured.prepLabel || "Chef’s pick"}</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/recipe/${featured.id}`} className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-deep">View Featured Recipe</Link>
              <Link href="/discover" className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">Browse More</Link>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-pad bg-surface/60">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Popular recipes</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">Loved by home cooks</h2>
            </div>
            <Link href="/discover" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">See all recipes <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {popularRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-pad">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Quick &amp; easy</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">Simple meals, big flavor</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent"><Clock className="h-4 w-4" aria-hidden="true" /> Perfect for busy days</div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {quickEasyRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-pad bg-surface/60">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Explore cuisines</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">Travel the world from your kitchen</h2>
            <p className="mt-4 text-base leading-7 text-muted">Find inspiration in flavors from around the globe, from comforting classics to vibrant spice-forward dishes.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {mockCuisines.map((cuisine) => (
              <Link key={cuisine.name} href={`/discover?area=${encodeURIComponent(cuisine.name)}`} className="group relative overflow-hidden rounded-[1.75rem] card-surface">
                <Image src={cuisine.image} alt={`${cuisine.name} cuisine`} width={900} height={1100} className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="font-display text-3xl font-semibold">{cuisine.name}</p>
                  <p className="mt-2 text-sm text-white/85">{cuisine.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-pad">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Browse categories</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">Whatever you&apos;re craving</h2>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">View all categories <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayCategories.map((category) => (
              <article key={category.id} className="card-surface group rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(45,42,38,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-muted">
                    <Image src={category.image} alt={category.name} width={96} height={96} className="h-16 w-16 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-foreground">{category.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted line-clamp-2">{category.description}</p>
                  </div>
                </div>
                <Link href={`/discover?category=${encodeURIComponent(category.name)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">
                  Explore category <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="section-pad bg-surface/60">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_1fr]">
          <RandomRecipeSection initialRecipe={randomRecipe} />
          <RecentlyViewedSection />
        </div>
      </MotionSection>

      <MotionSection className="py-16 sm:py-20">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-primary px-8 py-12 text-white sm:px-12 sm:py-14">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
            <div className="relative max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Ready to cook?</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Make the most of every ingredient in your kitchen.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/85">Search by what you have, save recipes you love, and build your shopping list as you go.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/ingredients" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-primary transition hover:bg-accent-soft">Find by Ingredients</Link>
                <Link href="/favorites" className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10">View Favorites</Link>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>
    </main>
  );
}
