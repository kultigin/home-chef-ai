import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { CuisineFilter } from "@/components/CuisineFilter";
import { useMeal } from "@/context/MealContext";

const Recipes = () => {
  const navigate = useNavigate();
  const { recipes, cuisineFilter, setCuisineFilter } = useMeal();

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
            {filtered.map((recipe, i) => (
              <RecipeCard key={i} recipe={recipe} highlightCuisine={cuisineFilter === "All"} onSelect={() => navigate(`/recipes/${i}`)} />
            ))}
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
