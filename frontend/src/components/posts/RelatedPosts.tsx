import { Link } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryDotClass } from "@/lib/category-colors";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types";

interface RelatedPostsProps {
  posts: PostSummary[];
  isLoading: boolean;
}

export function RelatedPosts({ posts, isLoading }: RelatedPostsProps) {
  if (!isLoading && posts.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Related posts</h2>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/posts/${post.slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    getCategoryDotClass(post.category),
                  )}
                />
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
