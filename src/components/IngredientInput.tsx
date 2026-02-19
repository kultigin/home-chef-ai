import { useState } from "react";
import { Plus, X, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ingredient } from "@/lib/types";
import { METRIC_UNITS, IMPERIAL_UNITS } from "@/lib/types";

interface IngredientInputProps {
  ingredients: Ingredient[];
  onAdd: (ingredient: Ingredient) => void;
  onRemove: (id: string) => void;
  unitSystem: "metric" | "imperial";
  onUnitSystemChange: (system: "metric" | "imperial") => void;
}

export function IngredientInput({ ingredients, onAdd, onRemove, unitSystem, onUnitSystemChange }: IngredientInputProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");

  const units = unitSystem === "metric" ? METRIC_UNITS : IMPERIAL_UNITS;

  const handleAdd = () => {
    if (!name.trim() || !amount.trim() || !unit) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: amount.trim(),
      unit,
    });
    setName("");
    setAmount("");
    setUnit("");
  };

  return (
    <div className="space-y-4">
      {/* Unit system toggle */}
      <div className="flex items-center gap-2 rounded-lg bg-secondary p-1">
        <button
          onClick={() => onUnitSystemChange("metric")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            unitSystem === "metric" ? "bg-primary text-primary-foreground shadow-warm" : "text-muted-foreground"
          }`}
        >
          Metric
        </button>
        <button
          onClick={() => onUnitSystemChange("imperial")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            unitSystem === "imperial" ? "bg-primary text-primary-foreground shadow-warm" : "text-muted-foreground"
          }`}
        >
          Imperial
        </button>
      </div>

      {/* Add ingredient form */}
      <div className="flex gap-2">
        <Input
          placeholder="Ingredient"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-card"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Input
          placeholder="Amt"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-20 bg-card"
          type="number"
          min="0"
          step="any"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger className="w-24 bg-card">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} size="icon" className="shrink-0 bg-warm-gradient shadow-warm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Ingredient list */}
      {ingredients.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
          <ChefHat className="h-10 w-10 opacity-40" />
          <p className="text-sm">Add your available ingredients above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div
              key={ing.id}
              className="flex items-center justify-between rounded-lg bg-card px-3 py-2 shadow-card animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="font-medium">{ing.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {ing.amount} {ing.unit}
                </span>
                <button onClick={() => onRemove(ing.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
