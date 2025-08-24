import { HTMLElement } from "node-html-parser";

/**
 * Extracts background image URL from CSS style attribute
 * Handles both single and double quotes, and HTML entity encoding
 */
export function extractBackgroundImageUrl(style: string): string | null {
  if (!style) return null;
  
  // First decode HTML entities
  const decodedStyle = style
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  
  // Match background-image: url("...") or url('...') patterns
  const urlMatch = decodedStyle.match(/background-image\s*:\s*url\s*\(\s*['"']?([^'"')]+)['"']?\s*\)/i);
  
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  
  return null;
}

/**
 * Extracts all background image URLs from style attributes in HTML elements
 */
export function extractBackgroundImages(elements: HTMLElement[]): string[] {
  const imageUrls: string[] = [];
  
  elements.forEach(element => {
    if (element.attributes?.style) {
      const url = extractBackgroundImageUrl(element.attributes.style);
      if (url) {
        imageUrls.push(url);
      }
    }
  });
  
  return imageUrls;
}