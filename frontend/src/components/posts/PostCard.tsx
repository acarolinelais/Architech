import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { getCategoryBadgeVariant, getCategoryFillClass } from "@/lib/category-colors";
import { cn, formatDate } from "@/lib/utils";
import type { PostSummary } from "@/types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      to={`/posts/${post.slug}`}
      className="block space-y-5 rounded-[2rem] bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={cn(
          "relative aspect-[16/9] w-full overflow-hidden rounded-2xl",
          !post.cover_image && getCategoryFillClass(post.category),
        )}
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : null}
        <Badge
          variant={getCategoryBadgeVariant(post.category)}
          className={cn("absolute left-4 top-4")}
        >
          {post.category.name}
        </Badge>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-sm text-muted-foreground">{formatDate(post.published_at)}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
