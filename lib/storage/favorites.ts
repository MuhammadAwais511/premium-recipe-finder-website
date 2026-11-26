import type { RecipeSummary } from "@/types/recipe";
import { FAVORITES_KEY, readStorage, writeStorage } from "./storage";

export function getFavorites(): RecipeSummary[] {
  return readStorage<RecipeSummary[]>(FAVORITES_KEY, []);
}

export function saveFavorites(favorites: RecipeSummary[]) {
  writeStorage(FAVORITES_KEY, favorites);
}

export function toggleFavorite(recipe: RecipeSummary): RecipeSummary[] {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.id === recipe.id);
  const next = exists ? favorites.filter((item) => item.id !== recipe.id) : [recipe, ...favorites];
  saveFavorites(next);
  return next;
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((item) => item.id === id);
}
