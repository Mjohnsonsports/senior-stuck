import Link from "next/link";
import type { BlogCategory } from "@/lib/blog/types";

export default function CategoryPill({ category }: { category?: BlogCategory }) {
  if (!category?.name) return null;

  const content = (
    <span className="inline-flex rounded-md bg-purple-100 px-3 py-1 text-sm font-bold text-purple-900">
      {category.name}
    </span>
  );

  return category.slug ? <Link href={`/blog/category/${category.slug}`}>{content}</Link> : content;
}
