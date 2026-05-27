import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { CuisineFilter } from "@/components/CuisineFilter";
import { useMeal } from "@/context/MealContext";
import { supabase } from "@/integrations/supabase/client";

const Recipes = () => {
  const navigate = useNavigate();
  const { recipes, cuisineFilter, setCuisineFilter, updateRecipe } = useMeal();
  const requested = useRef<Set<string>>(new Set());

  useEffect(() => {
    recipes.forEach((r, i) => {
      const key = `${i}:${r.name}`;
      if (r.image || r.imageLoading || requested.current.has(key)) return;
      requested.current.add(key);
      updateRecipe(i, { imageLoading: true });
      supabase.functions
        .invoke("generate-recipe-image", {
          body: { name: r.name, cuisine: r.cuisine, description: r.description },
        })
        .then(({ data, error }) => {
          if (error || data?.error || !data?.image) {
            updateRecipe(i, { imageLoading: false });
            return;
          }
          updateRecipe(i, { image: data.image, imageLoading: false });
        })
        .catch(() => updateRecipe(i, { imageLoading: false }));
    });
  }, [recipes, updateRecipe]);

  const filtered = cuisineFilter === "All" ? recipes : recipes.filter((r) => r.cuisine === cuisineFilter);

  return (
    <div className="min-h-screen bg-warm-gradient-subtle">
      <div className="mx-auto max-w-md px-4 py-6 space-y-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="font-display text-2xl">Recipes</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} found</p>
        </div>

        <CuisineFilter selected={cuisineFilter} onSelect={setCuisineFilter} />

        {recipes.length === 0 ? (
          <p className="text-sm text-muted-foreground pt-8 text-center">No recipes yet. Go back and generate some!</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((recipe) => {
              const originalIndex = recipes.indexOf(recipe);
              return (
                <RecipeCard
                  key={originalIndex}
                  recipe={recipe}
                  highlightCuisine={cuisineFilter === "All"}
                  onSelect={() => navigate(`/recipes/${originalIndex}`)}
                />
              );
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No recipes match this cuisine.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
