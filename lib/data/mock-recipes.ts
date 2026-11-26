import type { CategorySummary, RecipeSummary } from "@/types/recipe";

export const mockRecipes: RecipeSummary[] = [
  {
    id: "52772",
    name: "Teriyaki Chicken Casserole",
    image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    category: "Chicken",
    area: "Japanese",
    description: "A comforting baked casserole with savory teriyaki glaze, tender chicken, and hearty vegetables.",
    ingredients: ["chicken", "soy sauce", "ginger", "garlic", "rice"],
    prepLabel: "Weeknight favorite",
  },
  {
    id: "52802",
    name: "Fish Pie",
    image: "https://www.themealdb.com/images/media/meals/ysxwuq1487323065.jpg",
    category: "Seafood",
    area: "British",
    description: "Creamy, flaky, and satisfying — a classic family dish topped with golden mashed potatoes.",
    ingredients: ["fish", "potato", "milk", "onion", "parsley"],
    prepLabel: "Comfort classic",
  },
  {
    id: "52844",
    name: "Lasagne",
    image: "https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg",
    category: "Pasta",
    area: "Italian",
    description: "Layered pasta sheets with rich sauce, melted cheese, and a deeply satisfying baked finish.",
    ingredients: ["pasta", "beef", "tomato", "cheese", "onion"],
    prepLabel: "Family dinner",
  },
  {
    id: "52977",
    name: "Corba",
    image: "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
    category: "Side",
    area: "Turkish",
    description: "A warm, aromatic soup with gentle spice and a bright finish — perfect for a simple meal.",
    ingredients: ["lentils", "tomato", "onion", "carrot", "mint"],
    prepLabel: "Quick & easy",
  },
  {
    id: "53013",
    name: "Big Mac",
    image: "https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg",
    category: "Beef",
    area: "American",
    description: "A homemade take on the iconic burger with layers of flavor, crunch, and special sauce.",
    ingredients: ["beef", "lettuce", "cheese", "bun", "pickles"],
    prepLabel: "Fun at home",
  },
  {
    id: "52874",
    name: "Beef and Mustard Pie",
    image: "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
    category: "Beef",
    area: "British",
    description: "Tender beef in a rich mustard sauce wrapped in crisp pastry for a hearty, cozy meal.",
    ingredients: ["beef", "mustard", "pastry", "onion", "stock"],
    prepLabel: "Hearty bake",
  },
  {
    id: "52785",
    name: "Dal Fry",
    image: "https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg",
    category: "Vegetarian",
    area: "Indian",
    description: "Fragrant lentils tempered with spices, garlic, and herbs for a nourishing everyday dish.",
    ingredients: ["lentils", "garlic", "tomato", "cumin", "ghee"],
    prepLabel: "Quick & easy",
  },
  {
    id: "52811",
    name: "Ribollita",
    image: "https://www.themealdb.com/images/media/meals/xrrwpx1487347049.jpg",
    category: "Vegetarian",
    area: "Italian",
    description: "A rustic Tuscan soup packed with beans, vegetables, and bread for deep, wholesome flavor.",
    ingredients: ["beans", "kale", "carrot", "bread", "tomato"],
    prepLabel: "Wholesome bowl",
  },
];

export const quickEasyRecipes = mockRecipes.filter((recipe) =>
  ["52977", "52785", "52811", "52772"].includes(recipe.id),
);

export const popularRecipes = mockRecipes.filter((recipe) =>
  ["52844", "52772", "52802", "53013"].includes(recipe.id),
);

export const featuredRecipe = mockRecipes[0];

export const mockCategories: CategorySummary[] = [
  {
    id: "1",
    name: "Chicken",
    image: "https://www.themealdb.com/images/category/chicken.png",
    description: "Versatile, crowd-pleasing recipes for every day.",
  },
  {
    id: "2",
    name: "Seafood",
    image: "https://www.themealdb.com/images/category/seafood.png",
    description: "Fresh flavors from coastal kitchens around the world.",
  },
  {
    id: "3",
    name: "Vegetarian",
    image: "https://www.themealdb.com/images/category/vegetarian.png",
    description: "Plant-forward dishes full of color and comfort.",
  },
  {
    id: "4",
    name: "Dessert",
    image: "https://www.themealdb.com/images/category/dessert.png",
    description: "Sweet treats for celebrations and quiet moments.",
  },
  {
    id: "5",
    name: "Pasta",
    image: "https://www.themealdb.com/images/category/pasta.png",
    description: "Classic and modern pasta dishes everyone loves.",
  },
  {
    id: "6",
    name: "Beef",
    image: "https://www.themealdb.com/images/category/beef.png",
    description: "Rich, hearty meals with bold, satisfying flavor.",
  },
];

export const mockCuisines = [
  { name: "Italian", image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=900&q=80", note: "Comforting, timeless classics" },
  { name: "Japanese", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=900&q=80", note: "Clean flavors and balance" },
  { name: "Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80", note: "Vibrant spices and warmth" },
  { name: "Mexican", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80", note: "Bold, bright, festive dishes" },
];
