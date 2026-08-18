import { Link } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getCategoryDotClass } from "@/lib/category-colors";
import type { CategoryWithTags } from "@/types";

interface SidebarProps {
  categories: CategoryWithTags[];
  isLoading: boolean;
  activeTag: string | null;
  onSelectTag: (slug: string) => void;
}

export function Sidebar({ categories, isLoading, activeTag, onSelectTag }: SidebarProps) {
  return (
    <aside className="flex h-fit flex-col gap-8 rounded-2xl bg-card p-8">
      <Link to="/" className="flex items-center gap-2">
        <img src="/Logo.png" alt="Architech" className="h-8 w-auto" />
      </Link>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Tags</h2>

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
      </div>
    </aside>
  );
}
