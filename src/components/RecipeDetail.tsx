import { ArrowLeft, Clock, Users, AlertTriangle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/types";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <div className="animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to recipes
      </button>

      <div className="space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium">{recipe.cuisine}</span>
            <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-medium text-primary">{recipe.difficulty}</span>
          </div>
          <h2 className="font-display text-2xl leading-tight">{recipe.name}</h2>
          <p className="text-muted-foreground mt-1">{recipe.description}</p>

          <div className="flex items-center gap-5 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Prep {recipe.prepTime}m</span>
            <span className="flex items-center gap-1.5"><Flame className="h-4 w-4" /> Cook {recipe.cookTime}m</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {recipe.requestedServings} servings</span>
          </div>
        </div>

        {/* Warning */}
        {!recipe.hasEnoughIngredients && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <div className="flex items-center gap-2 text-destructive font-medium text-sm mb-1">
              <AlertTriangle className="h-4 w-4" />
              You'll need more ingredients
            </div>
            <ul className="text-sm text-destructive/80 space-y-0.5 ml-6 list-disc">
              {recipe.missingOrShort.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {recipe.hasEnoughIngredients && (
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
            <p className="text-sm text-accent font-medium">
              ✓ You have enough ingredients for {recipe.maxServings} servings!
            </p>
          </div>
        )}

        {/* Ingredients */}
        <div>
          <h3 className="font-display text-lg mb-3">Ingredients</h3>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 shadow-card">
                <span className="font-medium text-sm">{ing.name}</span>
                <span className="text-sm text-muted-foreground">{ing.amount} {ing.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h3 className="font-display text-lg mb-3">Instructions</h3>
          <div className="space-y-3">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-gradient text-xs font-bold text-primary-foreground mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
