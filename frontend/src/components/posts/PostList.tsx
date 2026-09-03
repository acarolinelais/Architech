import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "@/components/posts/PostCard";
import type { PostSummary } from "@/types";

interface PostListProps {
  posts: PostSummary[];
  isLoading: boolean;
  error: string | null;
}

export function PostList({ posts, isLoading, error }: PostListProps) {
  if (error) {
    return (
      <div className="surface-card rounded-[2rem] p-10 text-center text-sm text-muted-foreground">
        Não foi possível carregar os posts. Verifique se o backend está rodando em{" "}
        <code>http://localhost:5000</code>.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="surface-card rounded-[2rem] p-10 text-center text-sm text-muted-foreground">
        Nenhum post encontrado para esse filtro.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
