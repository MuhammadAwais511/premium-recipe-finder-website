export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealDetail extends MealSummary {
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: string]: string | null;
}

export interface RecipeSummary {
  id: string;
  name: string;
  image: string;
  category?: string;
  area?: string;
  description?: string;
  ingredients?: string[];
  prepLabel?: string;
}

export interface RecipeIngredient {
  ingredient: string;
  measure: string;
}

export interface RecipeDetail {
  id: string;
  name: string;
  image: string;
  category: string;
  area: string;
  instructions: string[];
  ingredients: RecipeIngredient[];
  tags: string[];
  youtube: string | null;
  source: string | null;
}

export interface CategorySummary {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface IngredientMatchRecipe extends RecipeSummary {
  matchedIngredients: string[];
  matchCount: number;
  totalRequested: number;
}
