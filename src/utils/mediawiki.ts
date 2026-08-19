import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";
/**
 * Trims the leading and trailing MediaWikiBreak elements from the contents.
 *
 * @param contents The contents to trim.
 * @returns The trimmed contents.
 */
export const trim = (contents: MediaWikiContent[]): MediaWikiContent[] => {
  if (!contents || contents.length === 0) {
    return contents;
  }
  while (
    contents[0] instanceof MediaWikiBreak ||
    contents[contents.length - 1] instanceof MediaWikiBreak
  ) {
    if (contents.length > 0 && contents[0] instanceof MediaWikiBreak) {
      contents.shift();
    }
    if (
      contents.length > 0 &&
      contents[contents.length - 1] instanceof MediaWikiBreak
    ) {
      contents.pop();
    }
  }
  return contents;
};

/**
 * Checks if the contents are empty.
 * @param contents The contents to check.
 * @returns True if the contents are empty, otherwise false.
 */
export const isEmpty = (
  contents: string | MediaWikiContent | MediaWikiContent[]
): boolean => {
  if (contents == null) {
    return true;
  }
  if (typeof contents === "string") {
    return contents.trim().length === 0;
  } else if (Array.isArray(contents)) {
    return contents.length === 0 || contents.every(isEmpty);
  } else if (contents instanceof MediaWikiContent) {
    return isEmpty(contents.children);
  }
  return false;
};

/**
 * Checks if the first child of the contents starts with the given string.
 *
 * @param contents The contents to check.
 * @param str The string to check against.
 * @returns True if the first child starts with the given string, otherwise false.
 */
export const startsWith = (
  contents: string | MediaWikiContent | MediaWikiContent[],
  str: string
): boolean => {
  if (isEmpty(contents)) {
    return false;
  }
  if (typeof contents === "string") {
    return contents.startsWith(str);
  }
  const childContents = Array.isArray(contents) ? contents[0] : contents;
  if (!childContents) {
    return false;
  }
  if (typeof childContents.children === "string") {
    return childContents.children.startsWith(str);
  }
  return startsWith(childContents.children, str);
};

/**
 * Recursively retrieves the first string content from the given MediaWikiContent.
 *
 * @param contents The MediaWikiContent to search through.
 * @returns The first string content found, or undefined if none is found.
 */
export const getFirstStringContent = (
  contents: MediaWikiContent
): MediaWikiContent | undefined => {
  if (typeof contents.children === "string") {
    return contents;
  } else if (contents.children instanceof MediaWikiContent) {
    return getFirstStringContent(contents.children);
  } else if (Array.isArray(contents.children) && contents.children.length > 0) {
    return getFirstStringContent(contents.children[0]);
  }
  return undefined;
};

/**
 * Recursively trims leading/trailing whitespace-only text at the edge of a content
 * tree, without disturbing interior spacing (e.g. text surrounding an inline link).
 *
 * @param content The content to trim.
 * @param edge Which edge to trim.
 */
export const trimContentEdge = (
  content: MediaWikiContent,
  edge: "start" | "end"
): void => {
  if (!(content instanceof MediaWikiText)) {
    return;
  }
  if (typeof content.children === "string") {
    content.children =
      edge === "start"
        ? content.children.replace(/^\s+/, "")
        : content.children.replace(/\s+$/, "");
  } else if (Array.isArray(content.children) && content.children.length > 0) {
    const index = edge === "start" ? 0 : content.children.length - 1;
    trimContentEdge(content.children[index], edge);
  }
};

/**
 * Trims leading whitespace from the first element and trailing whitespace from the
 * last element of a content array (a single-element array is trimmed on both edges).
 *
 * @param contents The content array to trim.
 */
export const trimContentEdges = (contents: MediaWikiContent[]): void => {
  if (!contents || contents.length === 0) {
    return;
  }
  trimContentEdge(contents[0], "start");
  trimContentEdge(contents[contents.length - 1], "end");
};

/**
 * Get the next non-break, non-whitespace content after a given index.
 * Skips over MediaWikiBreak elements and empty MediaWikiText elements.
 *
 * @param content The content array to search through
 * @param startIndex The index to start searching from
 * @returns An object with the found content (or null) and its index (-1 if not found)
 */
export const getNextContent = (
  content: MediaWikiContent[],
  startIndex: number
): { content: MediaWikiContent | null; index: number } => {
  for (let i = startIndex; i < content.length; i++) {
    const item = content[i];
    // Skip breaks
    if (item instanceof MediaWikiBreak) {
      continue;
    }
    // Skip empty/whitespace text
    if (item instanceof MediaWikiContent && isEmpty(item.children)) {
      continue;
    }
    return { content: item, index: i };
  }
  return { content: null, index: -1 };
};
