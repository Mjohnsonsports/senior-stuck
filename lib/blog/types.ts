export type BlogMedia = {
  id?: string;
  alt?: string;
  caption?: string;
  altText?: string;
  duration?: number;
  fileName?: string;
  filename?: string;
  height?: number;
  mimeType?: string;
  mediaType?: "image" | "video";
  publicUrl?: string;
  sizeBytes?: number;
  storagePath?: string;
  uploadedAt?: string;
  url?: string;
  width?: number;
};

export type BlogAuthor = {
  id?: string;
  name?: string;
  role?: string;
  bio?: string;
  avatar?: BlogMedia | string;
};

export type BlogCategory = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
};

export type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: BlogMedia | string;
  author?: BlogAuthor | string;
  category?: BlogCategory | string;
  tags?: { tag?: string }[];
  publishedAt?: string;
  status?: "draft" | "published";
  featured?: boolean;
  readingTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  body?: unknown[];
};

export type BlogQueryResult<T> = {
  data: T;
  error?: string;
};
