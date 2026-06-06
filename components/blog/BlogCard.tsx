import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { asAuthor, asCategory, asMedia, formatDate, mediaAlt, mediaUrl } from "@/lib/blog/utils";
import CategoryPill from "./CategoryPill";

export default function BlogCard({ post }: { post: BlogPost }) {
  const image = asMedia(post.coverImage);
  const imageUrl = mediaUrl(image);
  const author = asAuthor(post.author);
  const category = asCategory(post.category);

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-purple-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={mediaAlt(image, post.title)}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-lg font-bold text-purple-900">
              SeniorsStuck
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <CategoryPill category={category} />
        <h2 className="mt-4 text-2xl font-black leading-tight text-gray-950">
          <Link href={`/blog/${post.slug}`} className="hover:text-purple-800">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="mt-3 text-lg leading-relaxed text-gray-700">{post.excerpt}</p>
        ) : null}
        <div className="mt-5 text-base text-gray-600">
          {[author?.name, formatDate(post.publishedAt), post.readingTime ? `${post.readingTime} min read` : undefined]
            .filter(Boolean)
            .join(" - ")}
        </div>
      </div>
    </article>
  );
}
