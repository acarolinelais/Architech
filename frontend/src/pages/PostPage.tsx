import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AskCleberCard } from "@/components/layout/AskCleberCard";
import { CollectionsCard } from "@/components/layout/CollectionsCard";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/layout/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PostContent } from "@/components/posts/PostContent";
import { RelatedPosts } from "@/components/posts/RelatedPosts";
import { useCollections } from "@/hooks/useCollections";
import { fetchPost, fetchPosts } from "@/lib/api";
import { getCategoryBadgeVariant, getCategoryFillClass } from "@/lib/category-colors";
import { cn, formatDate } from "@/lib/utils";
import type { PostDetail, PostSummary } from "@/types";

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { collections, isLoading: isLoadingCollections } = useCollections();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [relatedPosts, setRelatedPosts] = useState<PostSummary[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  const [search, setSearch] = useState("");

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

  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    setIsLoadingRelated(true);

    fetchPosts({ category: post.category.slug })
      .then((data) => {
        if (!cancelled) setRelatedPosts(data.filter((item) => item.slug !== post.slug).slice(0, 5));
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRelated(false);
      });

    return () => {
      cancelled = true;
    };
  }, [post]);

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    navigate(`/?q=${encodeURIComponent(search)}`);
  }

  return (
    <div className="mx-auto max-w-[1600px] p-2 sm:p-3">
      <div className="page-backdrop grid gap-6 rounded-[2.5rem] p-4 sm:p-6 lg:grid-cols-[1fr_320px] lg:p-10">
        <div className="h-fit overflow-hidden rounded-[2rem] bg-card">
          <Header />

          {isLoading && (
            <div className="space-y-6 p-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          )}

          {error && !isLoading && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Post não encontrado.
            </div>
          )}

          {post && !isLoading && (
            <article className="space-y-6 p-8">
              <div
                className={cn(
                  "relative aspect-[16/7] w-full overflow-hidden rounded-[1.5rem]",
                  !post.cover_image && getCategoryFillClass(post.category),
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

              <div className="flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
                <Link to="/" className="transition-colors hover:text-foreground">
                  ← Voltar
                </Link>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="transition-colors hover:text-foreground"
                >
                  ↑ Topo
                </button>
              </div>
            </article>
          )}
        </div>

        <aside className="flex h-fit flex-col gap-6">
          <form onSubmit={handleSearchSubmit}>
            <SearchBar value={search} onChange={setSearch} />
          </form>

          <RelatedPosts posts={relatedPosts} isLoading={isLoadingRelated} />

          <AskCleberCard />

          <CollectionsCard
            collections={collections}
            isLoading={isLoadingCollections}
            activeCollection={null}
            onSelectCollection={(collectionSlug) => navigate(`/?collection=${collectionSlug}`)}
          />
        </aside>
      </div>
    </div>
  );
}
