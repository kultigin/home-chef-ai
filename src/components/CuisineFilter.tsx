import { CUISINES } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CuisineFilterProps {
  selected: string;
  onSelect: (cuisine: string) => void;
}

export function CuisineFilter({ selected, onSelect }: CuisineFilterProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              selected === c
                ? "bg-warm-gradient text-primary-foreground shadow-warm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
