import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types";

interface CollectionsCardProps {
  collections: Collection[];
  isLoading: boolean;
  activeCollection: string | null;
  onSelectCollection: (slug: string) => void;
}

export function CollectionsCard({
  collections,
  isLoading,
  activeCollection,
  onSelectCollection,
}: CollectionsCardProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= collections.length) setIndex(0);
  }, [collections.length, index]);

  if (!isLoading && collections.length === 0) return null;

  const current = collections[index];

  function goTo(delta: number) {
    setIndex((current) => (current + delta + collections.length) % collections.length);
  }

  return (
    <section className="rounded-[2rem] bg-secondary/60 pb-3 pt-6 text-center">
      <h2 className="mb-10 text-sm font-medium text-muted-foreground">Collections</h2>

      {isLoading ? (
        <div className="px-3">
          <Skeleton className="h-40 w-full rounded-[1.75rem]" />
        </div>
      ) : (
        <div className="px-3">
          <div className="surface-card relative rounded-[1.75rem] px-6 pb-5 pt-11">
            <span className="brand-gradient absolute left-1/2 top-0 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl shadow-sm">
              <img src="/frontend-collection.svg" alt="" className="h-9 w-9" />
            </span>

            <button
              type="button"
              onClick={() => current && onSelectCollection(current.slug)}
              className="flex w-full flex-col items-center gap-1"
            >
              <span
                className={cn(
                  "text-lg font-semibold transition-colors",
                  activeCollection === current?.slug && "text-brand",
                )}
              >
                {current?.name}
              </span>
              <span className="text-sm text-muted-foreground">{current?.post_count} posts</span>
            </button>

            {collections.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  aria-label="Coleção anterior"
                  className="absolute bottom-5 left-5 grid h-8 w-8 place-items-center rounded-full bg-accent transition-colors hover:bg-brand [&:hover>img]:invert [&:hover>img]:brightness-0"
                >
                  <img src="/left-arrow.svg" alt="" className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  aria-label="Próxima coleção"
                  className="absolute bottom-5 right-5 grid h-8 w-8 place-items-center rounded-full bg-accent transition-colors hover:bg-brand [&:hover>img]:invert [&:hover>img]:brightness-0"
                >
                  <img src="/right-arrow.svg" alt="" className="h-3 w-3" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
