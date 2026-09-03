import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getCategoryDotClass } from "@/lib/category-colors";
import type { CategoryWithTags } from "@/types";

interface SidebarProps {
  categories: CategoryWithTags[];
  isLoading: boolean;
  activeTag: string | null;
  onSelectTag: (slug: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function Sidebar({
  categories,
  isLoading,
  activeTag,
  onSelectTag,
  search,
  onSearchChange,
}: SidebarProps) {
  return (
    <div className="flex h-fit flex-col gap-6">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search keyword..."
      />

      <aside className="surface-card flex h-fit flex-col gap-4 rounded-[2rem] p-8">
        <h2 className="text-lg font-semibold">Tags</h2>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ) : (
          <nav className="space-y-5">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      getCategoryDotClass(category),
                    )}
                  />
                  {category.name}
                </div>
                <ul className="ml-4 space-y-2">
                  {category.tags.map((tag) => (
                    <li key={tag.id}>
                      <button
                        type="button"
                        onClick={() => onSelectTag(tag.slug)}
                        className={cn(
                          "text-sm text-muted-foreground transition-colors hover:text-foreground",
                          activeTag === tag.slug && "font-semibold text-foreground",
                        )}
                      >
                        {tag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </aside>
    </div>
  );
}
