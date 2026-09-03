import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowIcon } from "@/components/icons/Arrow";
import { cn } from "@/lib/utils";
import type { Category, SortOrder } from "@/types";

interface PostFiltersProps {
  categories: Category[];
  category: string;
  onCategoryChange: (slug: string) => void;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

export function PostFilters({
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: PostFiltersProps) {
  const activeLabel =
    category === "all"
      ? "All Posts"
      : (categories.find((item) => item.slug === category)?.name ?? "All Posts");

  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 text-md font-semibold outline-none">
          {activeLabel}
          <ArrowIcon className="h-2.5 w-2.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => onCategoryChange("all")}>
            All Posts
          </DropdownMenuItem>
          {categories.map((item) => (
            <DropdownMenuItem key={item.id} onSelect={() => onCategoryChange(item.slug)}>
              {item.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => onSortChange("desc")}
          className={cn(
            "font-medium text-foreground transition-colors",
            sort !== "desc" && "text-muted-foreground",
          )}
        >
          Desc
        </button>
        <button
          type="button"
          onClick={() => onSortChange("asc")}
          className={cn(
            "font-medium text-foreground transition-colors",
            sort !== "asc" && "text-muted-foreground",
          )}
        >
          Asc
        </button>
      </div>
    </div>
  );
}
