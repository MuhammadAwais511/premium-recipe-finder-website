import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/api/mealdb";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse recipe categories and find your next meal inspiration.",
};

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <main className="container-shell section-pad">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Categories</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Browse by category</h1>
        <p className="mt-4 text-base leading-7 text-muted">Explore recipes by category — from comforting classics to fresh new favorites.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="card-surface group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(45,42,38,0.1)]">
            <div className="flex items-center justify-center bg-surface-muted/60 p-8">
              <Image src={category.image} alt={category.name} width={240} height={240} className="h-36 w-36 object-contain transition duration-300 group-hover:scale-[1.03]" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">{category.name}</h2>
              <p className="mt-3 text-sm leading-7 text-muted line-clamp-3">{category.description || `Explore delicious ${category.name.toLowerCase()} recipes.`}</p>
              <Link href={`/discover?category=${encodeURIComponent(category.name)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-deep">
                Explore category <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
