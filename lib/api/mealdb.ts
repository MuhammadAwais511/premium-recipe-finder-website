import type {
  CategorySummary,
  IngredientMatchRecipe,
  MealCategory,
  MealDetail,
  MealSummary,
  RecipeDetail,
  RecipeIngredient,
  RecipeSummary,
} from "@/types/recipe";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function fetchMealDb<T>(path: string, revalidate = 3600): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`MealDB request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function normalizeMealSummary(meal: MealSummary): RecipeSummary {
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
  };
}

export function extractIngredients(meal: MealDetail): RecipeIngredient[] {
  const ingredients: RecipeIngredient[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (ingredient) {
      ingredients.push({
        ingredient,
        measure: measure || "",
      });
    }
  }
  return ingredients;
}

export function normalizeMealDetail(meal: MealDetail): RecipeDetail {
  const instructions = (meal.strInstructions || "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory?.trim() || "Unknown",
    area: meal.strArea?.trim() || "Unknown",
    instructions,
    ingredients: extractIngredients(meal),
    tags: meal.strTags
      ? meal.strTags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [],
    youtube: meal.strYoutube?.trim() || null,
    source: meal.strSource?.trim() || null,
  };
}

export async function searchRecipesByName(query: string): Promise<RecipeSummary[]> {
  const data = await fetchMealDb<{ meals: MealDetail[] | null }>(`/search.php?s=${encodeURIComponent(query)}`, 300);
  return (data.meals || []).map((meal) => {
    const detail = normalizeMealDetail(meal);
    return {
      id: detail.id,
      name: detail.name,
      image: detail.image,
      category: detail.category,
      area: detail.area,
      description: detail.instructions[0]?.slice(0, 140),
    };
  });
}

export async function getRecipesByIngredient(ingredient: string): Promise<RecipeSummary[]> {
  const data = await fetchMealDb<{ meals: MealSummary[] | null }>(`/filter.php?i=${encodeURIComponent(ingredient)}`, 300);
  return (data.meals || []).map(normalizeMealSummary);
}

export async function getRecipesByCategory(category: string): Promise<RecipeSummary[]> {
  const data = await fetchMealDb<{ meals: MealSummary[] | null }>(`/filter.php?c=${encodeURIComponent(category)}`, 600);
  return (data.meals || []).map((meal) => ({ ...normalizeMealSummary(meal), category }));
}

export async function getRecipesByArea(area: string): Promise<RecipeSummary[]> {
  const data = await fetchMealDb<{ meals: MealSummary[] | null }>(`/filter.php?a=${encodeURIComponent(area)}`, 600);
  return (data.meals || []).map((meal) => ({ ...normalizeMealSummary(meal), area }));
}

export async function getRecipeById(id: string): Promise<RecipeDetail | null> {
  const data = await fetchMealDb<{ meals: MealDetail[] | null }>(`/lookup.php?i=${encodeURIComponent(id)}`, 600);
  const meal = data.meals?.[0];
  return meal ? normalizeMealDetail(meal) : null;
}

export async function getRandomRecipe(): Promise<RecipeDetail | null> {
  const response = await fetch(`${BASE_URL}/random.php`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch random recipe");
  const data = (await response.json()) as { meals: MealDetail[] | null };
  const meal = data.meals?.[0];
  return meal ? normalizeMealDetail(meal) : null;
}

export async function getCategories(): Promise<CategorySummary[]> {
  const data = await fetchMealDb<{ categories: MealCategory[] | null }>("/categories.php", 3600);
  return (data.categories || []).map((category) => ({
    id: category.idCategory,
    name: category.strCategory,
    image: category.strCategoryThumb,
    description: category.strCategoryDescription?.replace(/\s+/g, " ").trim() || "",
  }));
}

export async function getAreas(): Promise<string[]> {
  const data = await fetchMealDb<{ meals: Array<{ strArea: string }> | null }>("/list.php?a=list", 3600);
  return (data.meals || []).map((item) => item.strArea).filter(Boolean);
}

export async function getCategoryList(): Promise<string[]> {
  const data = await fetchMealDb<{ meals: Array<{ strCategory: string }> | null }>("/list.php?c=list", 3600);
  return (data.meals || []).map((item) => item.strCategory).filter(Boolean);
}

export async function findRecipesByIngredients(ingredients: string[]): Promise<IngredientMatchRecipe[]> {
  const cleaned = [...new Set(ingredients.map((item) => item.trim().toLowerCase()).filter(Boolean))];
  if (cleaned.length === 0) return [];

  const results = await Promise.all(
    cleaned.map(async (ingredient) => {
      try {
        const meals = await getRecipesByIngredient(ingredient);
        return { ingredient, meals };
      } catch {
        return { ingredient, meals: [] as RecipeSummary[] };
      }
    }),
  );

  const counts = new Map<string, IngredientMatchRecipe>();
  for (const { ingredient, meals } of results) {
    for (const meal of meals) {
      const existing = counts.get(meal.id);
      if (existing) {
        if (!existing.matchedIngredients.includes(ingredient)) {
          existing.matchedIngredients.push(ingredient);
          existing.matchCount = existing.matchedIngredients.length;
        }
      } else {
        counts.set(meal.id, {
          ...meal,
          matchedIngredients: [ingredient],
          matchCount: 1,
          totalRequested: cleaned.length,
        });
      }
    }
  }

  const ranked = Array.from(counts.values()).sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    return a.name.localeCompare(b.name);
  });

  const top = ranked.slice(0, 24);
  const detailed = await Promise.all(
    top.map(async (recipe) => {
      try {
        const detail = await getRecipeById(recipe.id);
        if (!detail) return recipe;
        const detailIngredients = detail.ingredients.map((i) => i.ingredient.toLowerCase());
        const matchedIngredients = cleaned.filter((requested) =>
          detailIngredients.some((ing) => ing.includes(requested) || requested.includes(ing)),
        );
        return {
          ...recipe,
          image: detail.image || recipe.image,
          category: detail.category,
          area: detail.area,
          description: detail.instructions[0]?.slice(0, 140),
          ingredients: detail.ingredients.map((i) => i.ingredient),
          matchedIngredients: matchedIngredients.length > 0 ? matchedIngredients : recipe.matchedIngredients,
          matchCount: matchedIngredients.length > 0 ? matchedIngredients.length : recipe.matchCount,
        };
      } catch {
        return recipe;
      }
    }),
  );

  return detailed.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    return a.name.localeCompare(b.name);
  });
}
