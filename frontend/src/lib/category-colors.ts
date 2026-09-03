import type { Category } from "@/types";

type BadgeVariant = "backend" | "frontend" | "secondary";

const SLUG_TO_VARIANT: Record<string, BadgeVariant> = {
  backend: "backend",
  frontend: "frontend",
};

const SLUG_TO_DOT_CLASS: Record<string, string> = {
  backend: "bg-backend",
  frontend: "bg-frontend",
};

const SLUG_TO_FILL_CLASS: Record<string, string> = {
  backend: "bg-backend",
  frontend: "bg-frontend",
};

export function getCategoryBadgeVariant(category: Pick<Category, "slug">): BadgeVariant {
  return SLUG_TO_VARIANT[category.slug] ?? "secondary";
}

export function getCategoryDotClass(category: Pick<Category, "slug">): string {
  return SLUG_TO_DOT_CLASS[category.slug] ?? "bg-muted-foreground";
}

export function getCategoryFillClass(category: Pick<Category, "slug">): string {
  return SLUG_TO_FILL_CLASS[category.slug] ?? "bg-brand";
}
