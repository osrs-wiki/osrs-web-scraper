import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiHeader,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

class NewsHeaderTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    const transformedContent = [];
    for (let index = 0; index < content.length; index++) {
      const current = content[index];
      if (
        index > 0 &&
        index < content.length - 1 &&
        current instanceof MediaWikiText &&
        typeof current.children === "string" &&
        current.children.length <= 70 &&
        current.styling?.bold
      ) {
        const before = content[index - 1];
        const after = content[index + 1];
        if (
          before instanceof MediaWikiBreak &&
          after instanceof MediaWikiBreak
        ) {
          transformedContent.push(
            new MediaWikiHeader(current.children.trim(), 3)
          );
        } else {
          transformedContent.push(current);
        }
      } else {
        transformedContent.push(current);
      }
    }
    return transformedContent;
  }
}

export default NewsHeaderTransformer;
