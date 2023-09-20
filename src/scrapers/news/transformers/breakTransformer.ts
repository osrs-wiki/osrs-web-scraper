import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiTransformer,
} from "../../../utils/mediawiki";

class NewsBreakTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
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

export default NewsBreakTransformer;