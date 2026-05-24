import { useNavigate, useParams } from "react-router-dom";
import { RecipeDetail } from "@/components/RecipeDetail";
import { useMeal } from "@/context/MealContext";

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const { index } = useParams();
  const { recipes, cuisineFilter } = useMeal();

  const filtered = cuisineFilter === "All" ? recipes : recipes.filter((r) => r.cuisine === cuisineFilter);
  const recipe = filtered[Number(index)];

  return (
    <div className="min-h-screen bg-warm-gradient-subtle">
      <div className="mx-auto max-w-md px-4 py-6">
        {recipe ? (
          <RecipeDetail recipe={recipe} onBack={() => navigate("/recipes")} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Recipe not found.</p>
            <button onClick={() => navigate("/recipes")} className="text-sm text-primary underline">
              Back to recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;
