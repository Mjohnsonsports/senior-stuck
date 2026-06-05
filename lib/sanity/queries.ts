import { groq } from "next-sanity";
import type { BlogAuthor, BlogCategory, BlogMedia } from "@/lib/blog/types";
import { isValidSlug } from "@/lib/blog/utils";
import { sanityClient } from "./client";
import { sanityImageUrl } from "./image";
import type { SanityAuthor, SanityCategory, SanityImageLike, SanityPost } from "./types";

const postProjection = groq`
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  "author": author->{
    _id,
    name,
    role,
    bio,
    avatar,
    socialLinks
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current,
    description
  },
  tags,
  status,
  featured,
  publishedAt,
  seoTitle,
  seoDescription,
  body[]{
    ...,
    _type == "uploadedVideoBlock" => {
      ...,
      "fileUrl": file.asset->url,
      posterImage
    },
    _type == "imageUploadBlock" => {
      ...,
      image
    },
    _type == "productCardBlock" => {
      ...,
      image
    }
  }
`;

const publishedFilter = groq`
  _type == "post" &&
  status == "published" &&
  (!defined(publishedAt) || publishedAt <= now())
`;

type SanityPostRow = {
  _id?: string;
  _createdAt?: string;
  author?: SanityAuthor | null;
  body?: unknown[];
  category?: (SanityCategory & { _id?: string; title?: string }) | null;
  coverImage?: SanityImageLike | null;
  excerpt?: string;
  featured?: boolean;
  publishedAt?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug?: string;
  status?: "draft" | "published";
  tags?: string[];
  title?: string;
};

function mapImage(image?: SanityImageLike | null, fallbackAlt = ""): BlogMedia | undefined {
  if (!image) return undefined;

  const publicUrl = image.asset?.url || sanityImageUrl(image);
  if (!publicUrl) return undefined;

  return {
    altText: image.alt || fallbackAlt,
    caption: image.caption,
    publicUrl,
    url: publicUrl,
  };
}

function mapAuthor(author?: SanityAuthor | null): BlogAuthor | undefined {
  if (!author) return undefined;

  return {
    avatar: mapImage(author.avatar, author.name || "Author"),
    bio: author.bio,
    id: author.id || author._id,
    name: author.name,
    role: author.role,
  };
}

function mapCategory(category?: (SanityCategory & { title?: string; _id?: string }) | null): BlogCategory | undefined {
  if (!category) return undefined;

  return {
    description: category.description,
    id: category.id || category._id,
    name: category.name || category.title,
    slug: category.slug,
  };
}

function mapPost(row: SanityPostRow): SanityPost {
  return {
    author: mapAuthor(row.author),
    body: (Array.isArray(row.body) ? row.body : []) as unknown as SanityPost["body"],
    category: mapCategory(row.category),
    coverImage: mapImage(row.coverImage, row.title),
    excerpt: row.excerpt || undefined,
    featured: Boolean(row.featured),
    id: row._id,
    publishedAt: row.publishedAt || row._createdAt || undefined,
    seoDescription: row.seoDescription || undefined,
    seoTitle: row.seoTitle || undefined,
    slug: row.slug || "",
    status: row.status,
    tags: Array.isArray(row.tags) ? row.tags.map((tag: string) => ({ tag })) : [],
    title: row.title || "",
  };
}

async function fetchPosts(query: string, params: Record<string, unknown> = {}) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  const rows = await sanityClient.fetch<SanityPostRow[]>(query, params, {
    next: { revalidate: 60 },
  });
  return (rows || []).map(mapPost);
}

export async function getPublishedPosts() {
  return fetchPosts(
    groq`
      *[${publishedFilter}]
      | order(coalesce(publishedAt, _createdAt) desc)[0...24] {
        ${postProjection}
      }
    `,
  );
}

export async function getFeaturedPost() {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.featured) || posts[0];
}

export async function getPublishedPostBySlug(slug: string) {
  if (!isValidSlug(slug)) return null;

  const rows = await fetchPosts(
    groq`
      *[${publishedFilter} && slug.current == $slug][0...1] {
        ${postProjection}
      }
    `,
    { slug },
  );

  return rows[0] || null;
}

export async function getPostsByCategory(slug: string) {
  if (!isValidSlug(slug)) return [];

  return fetchPosts(
    groq`
      *[${publishedFilter} && category->slug.current == $slug]
      | order(coalesce(publishedAt, _createdAt) desc)[0...24] {
        ${postProjection}
      }
    `,
    { slug },
  );
}

export async function getCategories() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];

  const rows = await sanityClient.fetch<Array<{ _id: string; description?: string; slug?: string; title?: string }>>(
    groq`
      *[_type == "category" && defined(slug.current)]
      | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        description
      }
    `,
    {},
    { next: { revalidate: 60 } },
  );

  return (rows || []).map((row) => ({
    description: row.description,
    id: row._id,
    name: row.title,
    slug: row.slug,
  }));
}

export async function getRelatedPosts(post: SanityPost) {
  const category = typeof post.category === "object" ? post.category?.slug : undefined;
  const params = { category, slug: post.slug };

  const query = category
    ? groq`
        *[${publishedFilter} && slug.current != $slug && category->slug.current == $category]
        | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
          ${postProjection}
        }
      `
    : groq`
        *[${publishedFilter} && slug.current != $slug]
        | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
          ${postProjection}
        }
      `;

  return fetchPosts(query, params);
}
