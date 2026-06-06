import type { Metadata } from "next";
import MainNav from "@/components/MainNav";
import BlogCTA from "@/components/blog/BlogCTA";
import BlogHero from "@/components/blog/BlogHero";
import BlogList from "@/components/blog/BlogList";
import CategoryPill from "@/components/blog/CategoryPill";
import { getCategories, getPublishedPosts } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Blog - SeniorsStuck",
  description: "Practical online business articles and guidance for seniors 55+.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);
  const featured = posts.find((post) => post.featured) || posts[0];
  const remaining = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  return (
    <main className="min-h-screen bg-white">
      <MainNav />
      <BlogHero post={featured} />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {categories.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-3">
              {categories.map((category) => (
                <CategoryPill key={category.id || category.slug || category.name} category={category} />
              ))}
            </div>
          ) : null}
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-base font-bold uppercase text-purple-800">Latest</p>
              <h2 className="text-3xl font-black text-gray-950">Helpful articles</h2>
            </div>
          </div>
          <BlogList posts={remaining.length ? remaining : posts} />
          <div className="mt-12">
            <BlogCTA />
          </div>
        </div>
      </section>
    </main>
  );
}
