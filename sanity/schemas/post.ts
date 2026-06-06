import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextBlock } from "./blocks";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text" }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        layout: "radio",
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        portableTextBlock,
        defineArrayMember({ type: "imageUploadBlock" }),
        defineArrayMember({ type: "imageUrlBlock" }),
        defineArrayMember({ type: "youtubeVideoBlock" }),
        defineArrayMember({ type: "uploadedVideoBlock" }),
        defineArrayMember({ type: "ctaBlock" }),
        defineArrayMember({ type: "quoteBlock" }),
        defineArrayMember({ type: "faqBlock" }),
        defineArrayMember({ type: "dividerBlock" }),
        defineArrayMember({ type: "productCardBlock" }),
      ],
    }),
  ],
  preview: {
    select: {
      media: "coverImage",
      status: "status",
      title: "title",
    },
    prepare: ({ media, status, title }) => ({
      media,
      title,
      subtitle: status || "draft",
    }),
  },
});
