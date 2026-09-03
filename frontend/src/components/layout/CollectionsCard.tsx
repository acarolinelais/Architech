import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpandIcon } from "@/components/icons/Expand";
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
  if (!isLoading && collections.length === 0) return null;

  return (
    <section className="surface-card space-y-4 rounded-[2rem] p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Badge variant="brand" className="text-[10px] uppercase tracking-wide">
          New
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-1">
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              onClick={() => onSelectCollection(collection.slug)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-accent",
                activeCollection === collection.slug && "bg-accent",
              )}
            >
              <span className="grid h-10 w-10 shrink-0 grid-cols-2 gap-1 rounded-xl bg-brand/20 p-2.5">
                <span className="rounded-full bg-brand" />
                <span className="rounded-full bg-brand/40" />
                <span className="rounded-full bg-brand/40" />
                <span className="rounded-full bg-brand" />
              </span>
              <span className="flex-1 text-sm font-medium">{collection.name}</span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                <ExpandIcon className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
