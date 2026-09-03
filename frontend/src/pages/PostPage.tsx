import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PostContent } from "@/components/posts/PostContent";
import { fetchPost } from "@/lib/api";
import { getCategoryBadgeVariant, getCategoryGradientClass } from "@/lib/category-colors";
import { cn, formatDate } from "@/lib/utils";
import type { PostDetail } from "@/types";

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchPost(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-10">
      <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        ← Voltar para todos os posts
      </Link>

      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {error && !isLoading && (
        <div className="surface-card rounded-[2rem] p-10 text-center text-sm text-muted-foreground">
          Post não encontrado.
        </div>
      )}

      {post && !isLoading && (
        <article className="space-y-6">
          <div
            className={cn(
              "relative aspect-[16/7] w-full overflow-hidden rounded-[2rem]",
              !post.cover_image && getCategoryGradientClass(post.category),
            )}
          >
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            )}
            <Badge
              variant={getCategoryBadgeVariant(post.category)}
              className="absolute left-4 top-4"
            >
              {post.category.name}
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">{post.title}</h1>
            <p className="text-sm text-muted-foreground">{formatDate(post.published_at)}</p>
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

          <PostContent content={post.content} />
        </article>
      )}
    </div>
  );
}
