import { useNavigate } from "react-router-dom";
import { ChefHat, Sparkles, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IngredientInput } from "@/components/IngredientInput";
import { CuisineFilter } from "@/components/CuisineFilter";
import { useMeal } from "@/context/MealContext";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    ingredients, setIngredients,
    servings, setServings,
    unitSystem, setUnitSystem,
    cuisineFilter, setCuisineFilter,
    setRecipes,
    loading, setLoading,
  } = useMeal();

  const addIngredient = (ing: any) => setIngredients((prev) => [...prev, ing]);
  const removeIngredient = (id: string) => setIngredients((prev) => prev.filter((i) => i.id !== id));

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      toast({ title: "Add ingredients first", description: "Tell us what you have in your kitchen!", variant: "destructive" });
      return;
    }
    setLoading(true);
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
      navigate("/recipes");
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: e.message || "Failed to generate recipes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-warm-gradient-subtle flex flex-col">
      <div className="mx-auto w-full max-w-md px-4 py-4 flex-1 flex flex-col gap-3 min-h-0">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-warm-gradient shadow-warm mb-1">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl leading-tight">MealCraft</h1>
          <p className="text-xs text-muted-foreground">AI-powered recipes from your pantry</p>
        </div>

        {/* Ingredients (scrolls internally if many) */}
        <div className="flex-1 flex flex-col min-h-0">
          <h2 className="font-display text-sm mb-2">Your Ingredients</h2>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <IngredientInput
              ingredients={ingredients}
              onAdd={addIngredient}
              onRemove={removeIngredient}
              unitSystem={unitSystem}
              onUnitSystemChange={setUnitSystem}
            />
          </div>
        </div>

        {/* Servings */}
        <div>
          <h2 className="font-display text-xs mb-1">Servings</h2>
          <div className="flex items-center gap-3 rounded-lg bg-card p-2 shadow-card">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-lg font-bold">{servings}</span>
              <span className="text-xs text-muted-foreground ml-1">{servings === 1 ? "person" : "people"}</span>
            </div>
            <button
              onClick={() => setServings(Math.min(20, servings + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cuisine */}
        <div>
          <h2 className="font-display text-xs mb-1">Cuisine</h2>
          <CuisineFilter selected={cuisineFilter} onSelect={setCuisineFilter} />
        </div>

        {/* Generate button */}
        <Button
          onClick={generateRecipes}
          disabled={loading || ingredients.length === 0}
          className="w-full h-11 text-base font-semibold bg-warm-gradient shadow-warm hover:opacity-90"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Finding recipes...</>
          ) : (
            <><Sparkles className="mr-2 h-5 w-5" />Find Recipes with AI</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Index;
