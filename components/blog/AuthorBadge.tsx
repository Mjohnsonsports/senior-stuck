import Image from "next/image";
import type { BlogAuthor } from "@/lib/blog/types";
import { asMedia, mediaAlt, mediaUrl } from "@/lib/blog/utils";

export default function AuthorBadge({ author, date }: { author?: BlogAuthor; date?: string }) {
  const avatar = asMedia(author?.avatar);
  const avatarUrl = mediaUrl(avatar);

  return (
    <div className="flex items-center gap-3 text-base text-gray-700">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={mediaAlt(avatar, author?.name || "Author")}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-900">
          {(author?.name || "S").charAt(0)}
        </div>
      )}
      <div>
        <div className="font-bold text-gray-950">{author?.name || "SeniorsStuck"}</div>
        <div className="text-sm text-gray-600">{[author?.role, date].filter(Boolean).join(" - ")}</div>
      </div>
    </div>
  );
}
