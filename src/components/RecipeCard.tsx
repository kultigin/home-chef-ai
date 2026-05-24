import { Clock, Users, AlertTriangle, ChevronRight, Flame, Globe2 } from "lucide-react";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  highlightCuisine?: boolean;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-accent text-accent-foreground",
  Medium: "bg-primary/20 text-primary",
  Hard: "bg-destructive/20 text-destructive",
};

export function RecipeCard({ recipe, onSelect, highlightCuisine = false }: RecipeCardProps) {
  return (
    <button
      onClick={() => onSelect(recipe)}
      className="w-full text-left rounded-xl bg-card p-4 shadow-card hover:shadow-warm transition-all duration-300 animate-fade-in-up group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={
                highlightCuisine
                  ? "inline-flex items-center gap-1 rounded-full bg-warm-gradient px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-warm"
                  : "inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              }
            >
              {highlightCuisine && <Globe2 className="h-3 w-3" />}
              {recipe.cuisine}
            </span>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColor[recipe.difficulty] || ""}`}>
              {recipe.difficulty}
            </span>
          </div>
          <h3 className="font-display text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
            {recipe.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Up to {recipe.maxServings}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {recipe.cookTime}m cook
            </span>
          </div>

          {!recipe.hasEnoughIngredients && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Need more: {recipe.missingOrShort.slice(0, 2).join(", ")}{recipe.missingOrShort.length > 2 ? "..." : ""}</span>
            </div>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
      </div>
    </button>
  );
}
