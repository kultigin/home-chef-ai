import { Clock, Users, AlertTriangle, ChevronRight, Flame, ImageIcon } from "lucide-react";
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

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <button
      onClick={() => onSelect(recipe)}
      className="w-full text-left rounded-xl bg-card p-3 shadow-card hover:shadow-warm transition-all duration-300 animate-fade-in-up group"
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary/60 flex items-center justify-center">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {recipe.imageLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              ) : (
                <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {recipe.cuisine}
            </span>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColor[recipe.difficulty] || ""}`}>
              {recipe.difficulty}
            </span>
          </div>
          <h3 className="font-display text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {recipe.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{recipe.description}</p>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.maxServings}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {recipe.cookTime}m
            </span>
          </div>

          {!recipe.hasEnoughIngredients && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="truncate">Need more: {recipe.missingOrShort.slice(0, 2).join(", ")}</span>
            </div>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
      </div>
    </button>
  );
}
