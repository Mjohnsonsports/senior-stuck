import { author } from "./author";
import {
  ctaBlock,
  dividerBlock,
  faqBlock,
  imageUploadBlock,
  imageUrlBlock,
  productCardBlock,
  quoteBlock,
  uploadedVideoBlock,
  youtubeVideoBlock,
} from "./blocks";
import { category } from "./category";
import { post } from "./post";

export const schemaTypes = [
  author,
  category,
  post,
  imageUploadBlock,
  imageUrlBlock,
  youtubeVideoBlock,
  uploadedVideoBlock,
  ctaBlock,
  quoteBlock,
  faqBlock,
  dividerBlock,
  productCardBlock,
];
