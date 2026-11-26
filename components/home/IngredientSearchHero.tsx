"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X } from "lucide-react";

const suggestedIngredients = ["Chicken", "Tomatoes", "Eggs", "Rice", "Garlic"];

export function IngredientSearchHero() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(["Chicken", "Tomatoes", "Garlic"]);

  const addIngredient = (raw: string) => {
    const next = raw.trim().replace(/\s+/g, " ");
    if (!next) return;
    const exists = ingredients.some((item) => item.toLowerCase() === next.toLowerCase());
    if (exists) {
      setValue("");
      return;
    }
    setIngredients((prev) => [...prev, next]);
    setValue("");
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient));
  };

  const searchRecipes = () => {
    if (ingredients.length === 0) return;
    router.push(`/ingredients?items=${encodeURIComponent(ingredients.join(","))}`);
  };

  return (
    <div className="card-surface rounded-[2rem] p-5 sm:p-6">
      <label htmlFor="hero-ingredient" className="block text-sm font-semibold text-foreground">
        What ingredients do you have?
      </label>
      <p className="mt-1 text-sm text-muted">Add a few ingredients and we&apos;ll help you find matching recipes.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="hero-ingredient"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addIngredient(value);
              }
            }}
            placeholder="Try chicken, potatoes, or eggs"
            className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/80 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <button
          type="button"
          onClick={() => addIngredient(value)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground"
          >
            {ingredient}
            <button
              type="button"
              onClick={() => removeIngredient(ingredient)}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-foreground"
              aria-label={`Remove ${ingredient}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedIngredients.map((ingredient) => (
          <button
            key={ingredient}
            type="button"
            onClick={() => addIngredient(ingredient)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition hover:border-primary/30 hover:text-primary"
          >
            + {ingredient}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={searchRecipes}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-deep"
        >
          Search Matching Recipes
        </button>
        <button
          type="button"
          onClick={() => {
            setIngredients([]);
            setValue("");
          }}
          className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-muted transition hover:bg-surface-muted hover:text-foreground"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
