import { createContext, useContext, useState, ReactNode } from "react";
import type { Ingredient, Recipe } from "@/lib/types";

interface MealContextType {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  servings: number;
  setServings: (n: number) => void;
  unitSystem: "metric" | "imperial";
  setUnitSystem: (s: "metric" | "imperial") => void;
  cuisineFilter: string;
  setCuisineFilter: (s: string) => void;
  recipes: Recipe[];
  setRecipes: (r: Recipe[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
}

const MealContext = createContext<MealContextType | null>(null);

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [servings, setServings] = useState(2);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <MealContext.Provider
      value={{
        ingredients, setIngredients,
        servings, setServings,
        unitSystem, setUnitSystem,
        cuisineFilter, setCuisineFilter,
        recipes, setRecipes,
        loading, setLoading,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMeal = () => {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error("useMeal must be used within MealProvider");
  return ctx;
};
