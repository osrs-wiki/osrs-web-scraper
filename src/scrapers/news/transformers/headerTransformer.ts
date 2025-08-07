import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiHeader,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

import { getFirstStringContent } from "../../../utils/mediawiki";

class NewsHeaderTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    try {
      const transformedContent = [];
      for (let index = 0; index < content.length; index++) {
        const current = content[index];
        if (
          index > 0 &&
          index < content.length - 1 &&
          current instanceof MediaWikiText
        ) {
          const firstContent = getFirstStringContent(current);
          if (
            firstContent &&
            firstContent instanceof MediaWikiText &&
            firstContent.styling?.bold &&
            typeof firstContent.children === "string" &&
            firstContent.children.length < 70
          ) {
            const before = content[index - 1];
            const after = content[index + 1];
            if (
              before instanceof MediaWikiBreak &&
              after instanceof MediaWikiBreak
            ) {
              transformedContent.push(
                new MediaWikiHeader(firstContent.children, 4)
              );
            } else {
              transformedContent.push(current);
            }
          } else {
            transformedContent.push(current);
          }
        } else {
          transformedContent.push(current);
        }
      }
      return transformedContent;
    } catch (error) {
      console.error("Error transforming header:", error);
      return content;
    }
  }
}

export default NewsHeaderTransformer;
