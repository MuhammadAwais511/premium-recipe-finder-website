"use client";

import { useEffect } from "react";
import type { RecipeSummary } from "@/types/recipe";
import { addRecentlyViewed } from "@/lib/storage/recently-viewed";

export function RecentlyViewedRecorder({ recipe }: { recipe: RecipeSummary }) {
  useEffect(() => {
    addRecentlyViewed(recipe);
  }, [recipe]);
  return null;
}
