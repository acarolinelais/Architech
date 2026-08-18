import { useEffect, useMemo, useState } from "react";

import { fetchPosts } from "@/lib/api";
import type { PostSummary, SortOrder } from "@/types";

const SEARCH_DEBOUNCE_MS = 300;

export function usePosts() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [tag, setTag] = useState<string | null>(null);
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
  }, [debouncedSearch, category, tag, sort]);

  const toggleTag = useMemo(
    () => (slug: string) => setTag((current) => (current === slug ? null : slug)),
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
    sort,
    setSort,
  };
}
