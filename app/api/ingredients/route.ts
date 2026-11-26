import { NextResponse } from "next/server";
import { findRecipesByIngredients } from "@/lib/api/mealdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingredientsParam = searchParams.get("items");
  const ingredients = ingredientsParam
    ? ingredientsParam.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  if (ingredients.length === 0) {
    return NextResponse.json({ recipes: [] });
  }

  try {
    const recipes = await findRecipesByIngredients(ingredients);
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Ingredients API error", error);
    return NextResponse.json({ error: "Failed to search by ingredients" }, { status: 500 });
  }
}
