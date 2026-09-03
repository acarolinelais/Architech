import type {
  CategoryWithTags,
  ChatMessage,
  Collection,
  ContactLink,
  PostDetail,
  PostSummary,
  Profile,
  Project,
  SortOrder,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export interface PostFilters {
  q?: string;
  category?: string;
  tag?: string;
  collection?: string;
  sort?: SortOrder;
}

export function fetchPosts(filters: PostFilters = {}) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  return getJson<PostSummary[]>(`/api/posts${query ? `?${query}` : ""}`);
}

export function fetchPost(slug: string) {
  return getJson<PostDetail>(`/api/posts/${slug}`);
}

export function fetchTags() {
  return getJson<CategoryWithTags[]>("/api/tags");
}

export function fetchProfile() {
  return getJson<Profile>("/api/profile");
}

export function fetchProjects() {
  return getJson<Project[]>("/api/projects");
}

export function fetchContactLinks() {
  return getJson<ContactLink[]>("/api/contact");
}

export function fetchCollections() {
  return getJson<Collection[]>("/api/collections");
}

export async function postChatMessage(message: string, history: ChatMessage[]) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Falha ao falar com o Cleber.");
  }

  return data as { reply: string };
}
