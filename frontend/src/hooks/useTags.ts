import { useEffect, useState } from "react";

import { fetchTags } from "@/lib/api";
import type { CategoryWithTags } from "@/types";

export function useTags() {
  const [categories, setCategories] = useState<CategoryWithTags[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTags()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading };
}
