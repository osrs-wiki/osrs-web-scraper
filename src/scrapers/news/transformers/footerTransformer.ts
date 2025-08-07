import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiSeparator,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

import { startsWith } from "../../../utils/mediawiki";

class NewsFooterTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    try {
      const footerStartContent = content.filter((content) => {
        return (
          content instanceof MediaWikiText &&
          (startsWith(content, "You can also discuss") ||
            startsWith(content, "The Old School Team"))
        );
      });
      const footerStart = footerStartContent?.[0];
      if (footerStart) {
        const index = content.findIndex((content) => content === footerStart);
        if (index !== -1) {
          // Create the new elements first to ensure they're not undefined
          const separator = new MediaWikiSeparator();
          const break1 = new MediaWikiBreak();
          const break2 = new MediaWikiBreak();

          // Insert in reverse order to maintain correct indices
          content.splice(index, 0, separator, break1, break2);
        }
      }
    } catch (error) {
      console.error("Error transforming footer:", error);
    }

    // Filter out any undefined elements that might have been introduced
    return content.filter((item) => item != null);
  }
}

export default NewsFooterTransformer;
