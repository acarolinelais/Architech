import { Header } from "@/components/layout/Header";
import { ProfileSidebar } from "@/components/layout/ProfileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostFilters } from "@/components/posts/PostFilters";
import { PostList } from "@/components/posts/PostList";
import { usePosts } from "@/hooks/usePosts";
import { useTags } from "@/hooks/useTags";

export function HomePage() {
  const { categories, isLoading: isLoadingTags } = useTags();
  const {
    posts,
    isLoading: isLoadingPosts,
    error,
    search,
    setSearch,
    category,
    setCategory,
    tag,
    toggleTag,
    sort,
    setSort,
  } = usePosts();

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 p-6 lg:grid-cols-[280px_1fr_340px] lg:p-10">
      <Sidebar
        categories={categories}
        isLoading={isLoadingTags}
        activeTag={tag}
        onSelectTag={toggleTag}
      />

      <main className="space-y-8">
        <Header search={search} onSearchChange={setSearch} />
        <PostFilters
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />
        <PostList posts={posts} isLoading={isLoadingPosts} error={error} />
      </main>

      <ProfileSidebar />
    </div>
  );
}
