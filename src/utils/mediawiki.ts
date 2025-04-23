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
  } else if (Array.isArray(contents.children)) {
    return getFirstStringContent(contents.children[0]);
  }
  return undefined;
};
