import { useState } from "react";
import { ChefHat, Sparkles, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetail } from "@/components/RecipeDetail";
import { CuisineFilter } from "@/components/CuisineFilter";
import type { Ingredient, Recipe } from "@/lib/types";

const Index = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [servings, setServings] = useState(2);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const addIngredient = (ing: Ingredient) => setIngredients((prev) => [...prev, ing]);
  const removeIngredient = (id: string) => setIngredients((prev) => prev.filter((i) => i.id !== id));

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      toast({ title: "Add ingredients first", description: "Tell us what you have in your kitchen!", variant: "destructive" });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setSelectedRecipe(null);
    setRecipes([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-recipes", {
        body: {
          ingredients: ingredients.map(({ name, amount, unit }) => ({ name, amount, unit })),
          servings,
          cuisineFilter: cuisineFilter !== "All" ? cuisineFilter : null,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setRecipes(data.recipes || []);
      if ((data.recipes || []).length === 0) {
        toast({ title: "No recipes found", description: "Try adding more ingredients or changing the cuisine filter." });
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: e.message || "Failed to generate recipes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = cuisineFilter === "All" ? recipes : recipes.filter((r) => r.cuisine === cuisineFilter);

  // Recipe detail view
  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-warm-gradient-subtle">
        <div className="mx-auto max-w-md px-4 py-6">
          <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gradient-subtle">
      <div className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-warm-gradient shadow-warm mb-2">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl">MealCraft</h1>
          <p className="text-sm text-muted-foreground">AI-powered recipes from your pantry</p>
        </div>

        {/* Ingredient input */}
        <div>
          <h2 className="font-display text-lg mb-3">Your Ingredients</h2>
          <IngredientInput
            ingredients={ingredients}
            onAdd={addIngredient}
            onRemove={removeIngredient}
            unitSystem={unitSystem}
            onUnitSystemChange={setUnitSystem}
          />
        </div>

        {/* Servings */}
        <div>
          <h2 className="font-display text-lg mb-3">Servings</h2>
          <div className="flex items-center gap-4 rounded-lg bg-card p-3 shadow-card">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold">{servings}</span>
              <span className="text-sm text-muted-foreground ml-2">{servings === 1 ? "person" : "people"}</span>
            </div>
            <button
              onClick={() => setServings(Math.min(20, servings + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cuisine filter */}
        <div>
          <h2 className="font-display text-lg mb-3">Cuisine</h2>
          <CuisineFilter selected={cuisineFilter} onSelect={setCuisineFilter} />
        </div>

        {/* Generate button */}
        <Button
          onClick={generateRecipes}
          disabled={loading || ingredients.length === 0}
          className="w-full h-12 text-base font-semibold bg-warm-gradient shadow-warm hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finding recipes...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Find Recipes with AI
            </>
          )}
        </Button>

        {/* Results */}
        {hasSearched && !loading && (
          <div className="space-y-3">
            <h2 className="font-display text-lg">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? "Recipe" : "Recipes"} Found
            </h2>
            {recipes.length > 0 && filteredRecipes.length === 0 && (
              <p className="text-sm text-muted-foreground">No recipes match this cuisine. Try "All" to see all results.</p>
            )}
            {filteredRecipes.map((recipe, i) => (
              <RecipeCard key={i} recipe={recipe} onSelect={setSelectedRecipe} />
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-card p-4 shadow-card animate-pulse-warm" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="h-4 w-20 rounded bg-muted mb-2" />
                <div className="h-5 w-3/4 rounded bg-muted mb-1" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
