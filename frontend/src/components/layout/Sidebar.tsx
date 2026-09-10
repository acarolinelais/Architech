import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CategoryWithTags } from "@/types";

interface SidebarProps {
  categories: CategoryWithTags[];
  isLoading: boolean;
  activeTag: string | null;
  onSelectTag: (slug: string) => void;
}

export function Sidebar({ categories, isLoading, activeTag, onSelectTag }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!activeTag) return;
    const owner = categories.find((category) =>
      category.tags.some((tag) => tag.slug === activeTag),
    );
    if (!owner) return;
    setOpenCategories((current) =>
      current.has(owner.id) ? current : new Set(current).add(owner.id),
    );
  }, [activeTag, categories]);

  function toggleCategory(id: number) {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <aside className="surface-card flex h-fit flex-col gap-4 rounded-[2rem] p-8">
      <h2 className="text-lg font-semibold">Categories</h2>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      ) : (
        <nav className="space-y-4">
          {categories.map((category) => {
            const isOpen = openCategories.has(category.id);

            return (
              <div key={category.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center gap-2 text-left text-sm font-medium"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full border transition-colors",
                      isOpen
                        ? "border-brand bg-brand"
                        : "border-muted-foreground/50 bg-transparent",
                    )}
                  />
                  <span className={cn("transition-colors", isOpen ? "text-brand" : "text-foreground")}>
                    {category.name}
                  </span>
                </button>

                {isOpen && (
                  <ul className="ml-4 space-y-2">
                    {category.tags.map((tag) => (
                      <li key={tag.id}>
                        <button
                          type="button"
                          onClick={() => onSelectTag(tag.slug)}
                          className={cn(
                            "text-sm text-muted-foreground transition-colors hover:text-brand",
                            activeTag === tag.slug && "font-semibold text-brand",
                          )}
                        >
                          {tag.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
