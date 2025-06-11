import { MediaWikiBreak, MediaWikiContent } from "@osrs-wiki/mediawiki-builder";
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
