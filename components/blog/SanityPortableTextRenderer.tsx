import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityImageUrl } from "@/lib/sanity/image";

type BlockValue = Record<string, unknown>;

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function safeHref(value: unknown) {
  if (typeof value !== "string") return "";
  const href = value.trim();
  if (!href) return "";
  if (href.startsWith("/") || href.startsWith("#")) return href;

  try {
    const url = new URL(href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? href : "";
  } catch {
    return "";
  }
}

function safeImageUrl(value: unknown) {
  if (typeof value !== "string") return "";

  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function getYoutubeEmbedUrl(value: unknown) {
  if (typeof value !== "string") return "";

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v") || "";
      if (url.pathname.startsWith("/embed/")) videoId = url.pathname.split("/")[2] || "";
      if (url.pathname.startsWith("/shorts/")) videoId = url.pathname.split("/")[2] || "";
    }

    if (!/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

function placementClass(placement?: string) {
  if (placement === "full") return "mx-[calc(50%-50vw)] max-w-[100vw]";
  if (placement === "wide") return "mx-auto max-w-5xl";
  return "";
}

function FigureShell({
  caption,
  children,
  placement,
}: {
  caption?: string;
  children: React.ReactNode;
  placement?: string;
}) {
  return (
    <figure className={`my-8 ${placementClass(placement)}`}>
      {children}
      {caption ? <figcaption className="mt-3 text-base text-gray-600">{caption}</figcaption> : null}
    </figure>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-5 text-xl leading-relaxed text-gray-800">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 text-3xl font-black leading-tight text-gray-950">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-2xl font-black leading-tight text-gray-950">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-purple-600 pl-5 text-2xl font-bold text-gray-950">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-purple-50 px-1.5 py-0.5 text-base font-bold text-purple-950">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = safeHref((value as { href?: string })?.href);
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//.test(href);

      return external ? (
        <a
          href={href}
          rel="noreferrer"
          target="_blank"
          className="font-bold text-purple-800 underline decoration-purple-300 underline-offset-4 hover:text-purple-950"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="font-bold text-purple-800 underline decoration-purple-300 underline-offset-4 hover:text-purple-950"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 ml-6 list-outside list-disc space-y-2 text-xl leading-relaxed text-gray-800">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 ml-6 list-outside list-decimal space-y-2 text-xl leading-relaxed text-gray-800">
        {children}
      </ol>
    ),
  },
  listItem: ({ children }) => <li>{children}</li>,
  types: {
    imageUploadBlock: ({ value }) => {
      const block = value as BlockValue;
      const placement = textValue(block.placement);
      const imageUrl = sanityImageUrl(block.image, placement === "full" ? 1800 : 1200);
      if (!imageUrl) return null;

      return (
        <FigureShell caption={textValue(block.caption)} placement={placement}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-purple-50">
            <Image
              src={imageUrl}
              alt={textValue(block.alt)}
              fill
              className="object-cover"
              sizes={placement === "full" ? "100vw" : "(min-width: 1024px) 960px, 100vw"}
            />
          </div>
        </FigureShell>
      );
    },
    imageUrlBlock: ({ value }) => {
      const block = value as BlockValue;
      const imageUrl = safeImageUrl(block.url);
      if (!imageUrl) return null;

      return (
        <FigureShell caption={textValue(block.caption)} placement={textValue(block.placement)}>
          <div className="overflow-hidden rounded-lg bg-purple-50">
            {/* External URL images can come from arbitrary allowed editorial sources. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={textValue(block.alt)} className="h-auto w-full object-cover" loading="lazy" />
          </div>
        </FigureShell>
      );
    },
    youtubeVideoBlock: ({ value }) => {
      const block = value as BlockValue;
      const embedUrl = getYoutubeEmbedUrl(block.url);

      if (!embedUrl) {
        return process.env.NODE_ENV === "development" ? (
          <div className="my-8 rounded-lg border border-purple-200 bg-purple-50 p-5 font-bold text-purple-950">
            Invalid YouTube URL.
          </div>
        ) : null;
      }

      return (
        <FigureShell caption={textValue(block.caption)} placement={textValue(block.placement)}>
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <iframe
              src={embedUrl}
              title={textValue(block.title) || "YouTube video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </FigureShell>
      );
    },
    uploadedVideoBlock: ({ value }) => {
      const block = value as BlockValue;
      const poster = sanityImageUrl(block.posterImage, 1200);
      const fileUrl = textValue(block.fileUrl);
      if (!fileUrl) return null;

      return (
        <FigureShell caption={textValue(block.caption)} placement={textValue(block.placement)}>
          <video
            controls
            className="aspect-video w-full rounded-lg bg-black"
            poster={poster || undefined}
            preload="metadata"
            title={textValue(block.title)}
          >
            <source src={fileUrl} />
          </video>
        </FigureShell>
      );
    },
    ctaBlock: ({ value }) => {
      const block = value as BlockValue;
      const href = safeHref(block.href);
      if (!block.label || !href) return null;
      const secondary = block.style === "secondary";

      return (
        <div className="my-8">
          <Link
            href={href}
            className={`inline-flex rounded-md px-6 py-3 text-lg font-bold transition-colors ${
              secondary
                ? "border border-purple-700 text-purple-900 hover:bg-purple-50"
                : "bg-purple-700 text-white hover:bg-purple-800"
            }`}
          >
            {textValue(block.label)}
          </Link>
        </div>
      );
    },
    quoteBlock: ({ value }) => {
      const block = value as BlockValue;
      if (!block.quote) return null;

      return (
        <blockquote className="my-8 rounded-lg border-l-4 border-purple-700 bg-purple-50 p-6">
          <p className="text-2xl font-black leading-snug text-gray-950">{textValue(block.quote)}</p>
          {block.attribution ? (
            <footer className="mt-4 text-lg font-bold text-purple-900">{textValue(block.attribution)}</footer>
          ) : null}
        </blockquote>
      );
    },
    faqBlock: ({ value }) => {
      const items = Array.isArray((value as BlockValue).items) ? ((value as BlockValue).items as BlockValue[]) : [];
      if (items.length === 0) return null;

      return (
        <section className="my-8 space-y-3">
          {items.map((item, index) => (
            <details key={textValue(item._key) || index} className="rounded-lg border border-gray-200 bg-white p-5">
              <summary className="cursor-pointer text-xl font-black text-gray-950">{textValue(item.question)}</summary>
              {item.answer ? <p className="mt-3 text-lg leading-relaxed text-gray-700">{textValue(item.answer)}</p> : null}
            </details>
          ))}
        </section>
      );
    },
    dividerBlock: ({ value }) => {
      const block = value as BlockValue;

      return (
        <div className="my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-purple-200" />
          {block.label ? (
            <span className="text-sm font-bold uppercase text-purple-800">{textValue(block.label)}</span>
          ) : null}
          <div className="h-px flex-1 bg-purple-200" />
        </div>
      );
    },
    productCardBlock: ({ value }) => {
      const block = value as BlockValue;
      const href = safeHref(block.href);
      const imageUrl = sanityImageUrl(block.image, 1200);
      if (!block.title || !href) return null;

      return (
        <aside className="my-8 overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
          {imageUrl ? (
            <div className="relative aspect-[16/7] bg-purple-50">
              <Image src={imageUrl} alt={textValue(block.title)} fill className="object-cover" />
            </div>
          ) : null}
          <div className="p-6">
            <h3 className="text-2xl font-black text-gray-950">{textValue(block.title)}</h3>
            {block.description ? (
              <p className="mt-3 text-lg leading-relaxed text-gray-700">{textValue(block.description)}</p>
            ) : null}
            <Link
              href={href}
              className="mt-5 inline-flex rounded-md bg-purple-700 px-5 py-3 text-lg font-bold text-white hover:bg-purple-800"
            >
              {textValue(block.buttonLabel) || "Learn more"}
            </Link>
          </div>
        </aside>
      );
    },
  },
};

export default function SanityPortableTextRenderer({ value = [] }: { value?: PortableTextBlock[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <PortableText value={value} components={components} />
    </div>
  );
}
