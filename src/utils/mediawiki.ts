import { MediaWikiBreak, MediaWikiContent } from "@osrs-wiki/mediawiki-builder";

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
