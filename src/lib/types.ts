export type Ingredient = {
  id: string;
  name: string;
  amount: string;
  unit: string;
};

export type Recipe = {
  name: string;
  cuisine: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  maxServings: number;
  requestedServings: number;
  hasEnoughIngredients: boolean;
  missingOrShort: string[];
  ingredients: { name: string; amount: string; unit: string }[];
  steps: string[];
  image?: string;
  imageLoading?: boolean;
};

export const METRIC_UNITS = ["g", "kg", "ml", "L", "tsp", "tbsp", "pcs", "cups"];
export const IMPERIAL_UNITS = ["oz", "lb", "fl oz", "cups", "tsp", "tbsp", "pcs", "qt", "gal"];

export const CUISINES = [
  "All",
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Thai",
  "French",
  "Chinese",
  "Korean",
  "Ethiopian",
  "Peruvian",
  "Greek",
  "Turkish",
  "Vietnamese",
  "American",
  "Spanish",
  "Moroccan",
];
