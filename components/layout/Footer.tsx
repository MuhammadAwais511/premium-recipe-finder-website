import Link from "next/link";
import { ChefHat, Globe, Heart, Mail, Share2 } from "lucide-react";

const footerLinks = [
  { href: "/discover", label: "Discover Recipes" },
  { href: "/ingredients", label: "Find by Ingredients" },
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorites" },
  { href: "/shopping-list", label: "Shopping List" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-foreground">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
              <ChefHat className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-2xl font-semibold">What&apos;s In My Kitchen?</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">
            A warm, practical recipe companion that helps you turn everyday ingredients into meals worth sharing.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="mailto:hello@whatsinmykitchen.app" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/30 hover:text-primary" aria-label="Email">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/30 hover:text-primary" aria-label="Recipe data source">
              <Globe className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/30 hover:text-primary" aria-label="Built with Next.js">
              <Share2 className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Explore</p>
          <ul className="mt-4 space-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Made for real kitchens</p>
          <p className="mt-4 text-sm leading-7 text-muted">
            Search by name, cook from what you have, save favorites, and build a shopping list — all in one place.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent">
            <Heart className="h-4 w-4" aria-hidden="true" />
            Cook with confidence
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 py-5">
        <div className="container-shell flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 What&apos;s In My Kitchen? All rights reserved.</p>
          <p>Recipe data powered by TheMealDB in upcoming phases.</p>
        </div>
      </div>
    </footer>
  );
}
