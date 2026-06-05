import type { BlogPost } from "@/lib/blog/types";

export type SanityImageLike = {
  _type?: "image";
  alt?: string;
  caption?: string;
  asset?: {
    _ref?: string;
    _type?: "reference";
    url?: string;
  };
  crop?: unknown;
  hotspot?: unknown;
};

export type SanityCategory = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
};

export type SanityAuthor = {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
  bio?: string;
  avatar?: SanityImageLike;
  socialLinks?: { label?: string; url?: string }[];
};

export type SanityPost = BlogPost;
