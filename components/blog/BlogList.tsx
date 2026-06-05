import type { BlogPost } from "@/lib/blog/types";
import BlogCard from "./BlogCard";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-purple-200 bg-white p-8 text-center">
        <h2 className="text-2xl font-black text-gray-950">No published posts yet</h2>
        <p className="mt-3 text-lg text-gray-700">Check back soon for new SeniorsStuck articles.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id || post.slug} post={post} />
      ))}
    </div>
  );
}
