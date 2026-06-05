import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { asCategory, asMedia, mediaAlt, mediaUrl } from "@/lib/blog/utils";
import CategoryPill from "./CategoryPill";

export default function BlogHero({ post }: { post?: BlogPost }) {
  if (!post) {
    return (
      <section className="bg-linear-to-r from-[#1a0733] via-[#120625] to-black px-4 pb-14 pt-36 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg font-bold text-purple-200">SeniorsStuck Blog</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Practical online business guidance for 55+
          </h1>
        </div>
      </section>
    );
  }

  const image = asMedia(post.coverImage);
  const imageUrl = mediaUrl(image);
  const category = asCategory(post.category);

  return (
    <section className="bg-linear-to-r from-[#1a0733] via-[#120625] to-black px-4 pb-14 pt-36 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-lg font-bold text-purple-200">Featured article</p>
          <div className="mt-4">
            <CategoryPill category={category} />
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt ? (
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-purple-50">{post.excerpt}</p>
          ) : null}
          <Link
            href={`/blog/${post.slug}`}
            className="mt-7 inline-flex rounded-md bg-white px-6 py-3 text-lg font-bold text-purple-950 transition-colors hover:bg-purple-100"
          >
            Read article
          </Link>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-white/10">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={mediaAlt(image, post.title)}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-black text-purple-100">
              SeniorsStuck
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
