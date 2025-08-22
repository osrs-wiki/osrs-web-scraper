import { HTMLElement } from "node-html-parser";

/**
 * Check if an element is within a thumbnails section
 */
export function isWithinThumbnails(element: HTMLElement): boolean {
  let current = element.parentNode;
  while (current) {
    if (current.attributes?.id === "thumbnails") {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}