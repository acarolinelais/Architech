export interface Category {
  id: number;
  name: string;
  slug: string;
  color: "indigo" | "pink" | string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryWithTags extends Category {
  tags: Tag[];
}

export interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  category: Category;
  tags: Tag[];
}

export interface PostDetail extends PostSummary {
  content: string;
}

export interface Profile {
  id: number;
  name: string;
  role: string;
  bio: string;
  about: string;
  avatar_url: string | null;
  avatar_initials: string;
}

export interface Project {
  id: number;
  name: string;
  url: string | null;
  description: string | null;
}

export interface ContactLink {
  id: number;
  platform: "github" | "linkedin" | string;
  label: string;
  url: string;
}

export type SortOrder = "desc" | "asc";
