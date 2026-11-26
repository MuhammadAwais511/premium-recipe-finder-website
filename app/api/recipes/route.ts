import { NextResponse } from "next/server";
import { getAreas, getCategories, getCategoryList, getRandomRecipe, getRecipeById, getRecipesByArea, getRecipesByCategory, searchRecipesByName } from "@/lib/api/mealdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const area = searchParams.get("area");
  const random = searchParams.get("random");
  const meta = searchParams.get("meta");

  try {
    if (meta === "filters") {
      const [categories, areas] = await Promise.all([getCategoryList(), getAreas()]);
      return NextResponse.json({ categories, areas });
    }

    if (random === "true") {
      const recipe = await getRandomRecipe();
      return NextResponse.json({ recipe });
    }

    if (id) {
      const recipe = await getRecipeById(id);
      if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
      return NextResponse.json({ recipe });
    }

    if (query) {
      const recipes = await searchRecipesByName(query);
      return NextResponse.json({ recipes });
    }

    if (category) {
      const recipes = await getRecipesByCategory(category);
      return NextResponse.json({ recipes });
    }

    if (area) {
      const recipes = await getRecipesByArea(area);
      return NextResponse.json({ recipes });
    }

    const [categories] = await Promise.all([getCategories()]);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Recipes API error", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
