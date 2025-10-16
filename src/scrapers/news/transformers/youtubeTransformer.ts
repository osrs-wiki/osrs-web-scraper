import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiHTML,
  MediaWikiTemplate,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

class NewsYoutubeTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    if (content.length < 1) {
      return content;
    }
    try {
      const transformedContent = [];
      for (let index = 0; index < content.length; index++) {
        const current = content[index];
        
        // Check if current item is a YouTube template
        if (current instanceof MediaWikiTemplate && current.name === "Youtube") {
          // Check if there's a following caption
          // Pattern 1: break + text (original pattern)
          const nextBreak = index + 1 < content.length ? content[index + 1] : null;
          const nextText = index + 2 < content.length ? content[index + 2] : null;
          
          // Pattern 2: text only (from paragraph wrapping)
          const nextItem = index + 1 < content.length ? content[index + 1] : null;
          
          if (
            nextBreak instanceof MediaWikiBreak &&
            nextText instanceof MediaWikiText
          ) {
            // Pattern 1: Wrap YouTube template, break, and caption text in center tags
            transformedContent.push(
              new MediaWikiHTML(
                "center",
                [current, nextBreak, nextText],
                {},
                { collapsed: false }
              )
            );
            index += 2; // Skip the break and text we just processed
          } else if (nextItem instanceof MediaWikiText) {
            // Pattern 2: Wrap YouTube template and text (from paragraph) in center tags
            transformedContent.push(
              new MediaWikiHTML(
                "center",
                [current, nextItem],
                {},
                { collapsed: false }
              )
            );
            index += 1; // Skip the text we just processed
          } else {
            // Just wrap the YouTube template in center tags
            transformedContent.push(
              new MediaWikiHTML(
                "center",
                [current],
                {},
                { collapsed: false }
              )
            );
          }
        } else {
          transformedContent.push(current);
        }
      }
      return transformedContent;
    } catch (error) {
      console.error("Error transforming YouTube content:", error);
      return content;
    }
  }
}

export default NewsYoutubeTransformer;