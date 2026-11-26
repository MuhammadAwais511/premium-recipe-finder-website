"use client";

import { useCallback, useEffect, useState } from "react";
import type { RecipeSummary } from "@/types/recipe";
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from "./favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<RecipeSummary[]>([]);

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    queueMicrotask(refresh);
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("wmk-storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wmk-storage", onStorage);
    };
  }, [refresh]);

  const toggleFavorite = useCallback((recipe: RecipeSummary) => {
    const next = toggleFavoriteStorage(recipe);
    setFavorites(next);
    return next.some((item) => item.id === recipe.id);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.some((item) => item.id === id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
