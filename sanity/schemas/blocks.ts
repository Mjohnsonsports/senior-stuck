import { defineArrayMember, defineField, defineType } from "sanity";

const placementField = defineField({
  name: "placement",
  title: "Placement",
  type: "string",
  initialValue: "normal",
  options: {
    layout: "radio",
    list: [
      { title: "Normal", value: "normal" },
      { title: "Wide", value: "wide" },
      { title: "Full", value: "full" },
    ],
  },
});

export const imageUploadBlock = defineType({
  name: "imageUploadBlock",
  title: "Uploaded image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    placementField,
  ],
  preview: {
    select: { media: "image", title: "alt", subtitle: "caption" },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title || "Uploaded image",
      subtitle,
    }),
  },
});

export const imageUrlBlock = defineType({
  name: "imageUrlBlock",
  title: "External image URL",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Image URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    placementField,
  ],
});

export const youtubeVideoBlock = defineType({
  name: "youtubeVideoBlock",
  title: "YouTube video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    placementField,
  ],
});

export const uploadedVideoBlock = defineType({
  name: "uploadedVideoBlock",
  title: "Uploaded video",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "Video file",
      type: "file",
      options: { accept: "video/*" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "posterImage",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    placementField,
  ],
});

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Href",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "primary",
      options: {
        layout: "radio",
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
        ],
      },
    }),
  ],
});

export const quoteBlock = defineType({
  name: "quoteBlock",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "attribution", title: "Attribution", type: "string" }),
  ],
});

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          name: "faqItem",
          title: "FAQ item",
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text" }),
          ],
        }),
      ],
    }),
  ],
});

export const dividerBlock = defineType({
  name: "dividerBlock",
  title: "Divider",
  type: "object",
  fields: [defineField({ name: "label", title: "Optional label", type: "string" })],
});

export const productCardBlock = defineType({
  name: "productCardBlock",
  title: "Product card",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "href", title: "Href", type: "string" }),
    defineField({ name: "buttonLabel", title: "Button label", type: "string" }),
  ],
});

export const portableTextBlock = defineArrayMember({
  name: "block",
  title: "Text",
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Blockquote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
    ],
    annotations: [
      defineArrayMember({
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "Href",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
        ],
      }),
    ],
  },
});
