import type { RecipeSummary } from "@/types/recipe";
import { readStorage, RECENTLY_VIEWED_KEY, writeStorage } from "./storage";

export function getRecentlyViewed(): RecipeSummary[] {
  return readStorage<RecipeSummary[]>(RECENTLY_VIEWED_KEY, []);
}

export function addRecentlyViewed(recipe: RecipeSummary) {
  const items = getRecentlyViewed().filter((item) => item.id !== recipe.id);
  const next = [recipe, ...items].slice(0, 8);
  writeStorage(RECENTLY_VIEWED_KEY, next);
}
