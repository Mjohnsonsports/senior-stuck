import type { Metadata } from "next";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { notFound } from "next/navigation";
import MainNav from "@/components/MainNav";
import AuthorBadge from "@/components/blog/AuthorBadge";
import BlogCard from "@/components/blog/BlogCard";
import BlogCTA from "@/components/blog/BlogCTA";
import CategoryPill from "@/components/blog/CategoryPill";
import SanityPortableTextRenderer from "@/components/blog/SanityPortableTextRenderer";
import { asAuthor, asCategory, asMedia, formatDate, isValidSlug, mediaAlt, mediaUrl } from "@/lib/blog/utils";
import { getPublishedPostBySlug, getRelatedPosts } from "@/lib/sanity/queries";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const coverImage = asMedia(post.coverImage);
  const coverImageUrl = mediaUrl(coverImage);
  return {
    title: post.seoTitle || `${post.title} - SeniorsStuck`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: coverImageUrl ? [{ url: coverImageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const [author, category, coverImage, related] = await Promise.all([
    Promise.resolve(asAuthor(post.author)),
    Promise.resolve(asCategory(post.category)),
    Promise.resolve(asMedia(post.coverImage)),
    getRelatedPosts(post),
  ]);
  const coverImageUrl = mediaUrl(coverImage);

  return (
    <main className="min-h-screen bg-white">
      <MainNav />
      <article>
        <header className="bg-linear-to-r from-[#1a0733] via-[#120625] to-black px-4 pb-12 pt-36 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <CategoryPill category={category} />
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{post.title}</h1>
            {post.excerpt ? (
              <p className="mt-5 text-xl leading-relaxed text-purple-50">{post.excerpt}</p>
            ) : null}
            <div className="mt-7 rounded-lg bg-white p-4">
              <AuthorBadge author={author} date={formatDate(post.publishedAt)} />
            </div>
          </div>
        </header>

        {coverImageUrl ? (
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-lg bg-purple-50">
              <Image
                src={coverImageUrl}
                alt={mediaAlt(coverImage, post.title)}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
              />
            </div>
          </div>
        ) : null}

        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <SanityPortableTextRenderer value={(post.body || []) as unknown as PortableTextBlock[]} />
        </section>
      </article>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <BlogCTA />
          {related.length > 0 ? (
            <div className="mt-12">
              <h2 className="mb-6 text-3xl font-black text-gray-950">Related articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((item) => (
                  <BlogCard key={item.id || item.slug} post={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
