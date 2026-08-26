import { HTMLElement } from "node-html-parser";

/**
 * Check if an element is within a thumbnails section
 * (either the legacy `id="thumbnails"` container or the
 * `.osrs-carousel__thumbs` rail, which is populated client-side with
 * duplicate copies of the carousel slide images)
 */
export function isWithinThumbnails(element: HTMLElement): boolean {
  let current = element.parentNode;
  while (current) {
    if (
      current.attributes?.id === "thumbnails" ||
      current.classList?.contains("osrs-carousel__thumbs")
    ) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}
