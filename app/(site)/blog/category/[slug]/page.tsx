import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MainNav from "@/components/MainNav";
import BlogList from "@/components/blog/BlogList";
import { isValidSlug } from "@/lib/blog/utils";
import { getCategories, getPostsByCategory } from "@/lib/sanity/queries";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) return {};

  return {
    title: `${category.name || "Blog Category"} - SeniorsStuck`,
    description: category.description,
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const [posts, categories] = await Promise.all([
    getPostsByCategory(slug),
    getCategories(),
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <main className="min-h-screen bg-white">
      <MainNav />
      <section className="bg-linear-to-r from-[#1a0733] via-[#120625] to-black px-4 pb-12 pt-36 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg font-bold text-purple-200">Blog category</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            {category?.name || "Articles"}
          </h1>
          {category?.description ? (
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-purple-50">{category.description}</p>
          ) : null}
        </div>
      </section>
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <BlogList posts={posts} />
        </div>
      </section>
    </main>
  );
}
