import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { fetchPosts } from "@/lib/api";
import type { PostSummary, SortOrder } from "@/types";

const SEARCH_DEBOUNCE_MS = 300;

export function usePosts() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState<string>("all");
  const [tag, setTag] = useState<string | null>(null);
  const [collection, setCollection] = useState<string | null>(
    () => searchParams.get("collection"),
  );
  const [sort, setSort] = useState<SortOrder>("desc");

  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchPosts({
      q: debouncedSearch || undefined,
      category: category === "all" ? undefined : category,
      tag: tag ?? undefined,
      collection: collection ?? undefined,
      sort,
    })
      .then((data) => {
        if (!cancelled) setPosts(data);
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
  }, [debouncedSearch, category, tag, collection, sort]);

  const toggleTag = useMemo(
    () => (slug: string) => setTag((current) => (current === slug ? null : slug)),
    [],
  );

  const toggleCollection = useMemo(
    () => (slug: string) => setCollection((current) => (current === slug ? null : slug)),
    [],
  );

  return {
    posts,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    tag,
    setTag,
    toggleTag,
    collection,
    setCollection,
    toggleCollection,
    sort,
    setSort,
  };
}
