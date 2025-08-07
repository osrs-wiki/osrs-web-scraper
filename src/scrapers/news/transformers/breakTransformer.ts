import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiHeader,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

class NewsBreakTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    try {
      const transformedContent = [];
      for (let index = 0; index < content.length; index++) {
        const current = content[index];
        if (
          index > 0 &&
          index < content.length - 1 &&
          current instanceof MediaWikiBreak
        ) {
          const before = content[index - 1];
          const after = content[index + 1];
          if (
            before instanceof MediaWikiBreak &&
            after instanceof MediaWikiBreak
          ) {
            index++;
          } else if (
            before instanceof MediaWikiHeader &&
            after instanceof MediaWikiBreak
          ) {
            continue;
          } else {
            transformedContent.push(current);
          }
        } else {
          transformedContent.push(current);
        }
      }
      return transformedContent;
    } catch (error) {
      console.error("Error transforming breaks:", error);
      return content;
    }
  }
}

export default NewsBreakTransformer;
