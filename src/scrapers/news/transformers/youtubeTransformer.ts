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
          // Check if there's a following caption (break + text pattern)
          const nextBreak = index + 1 < content.length ? content[index + 1] : null;
          const nextText = index + 2 < content.length ? content[index + 2] : null;
          
          if (
            nextBreak instanceof MediaWikiBreak &&
            nextText instanceof MediaWikiText
          ) {
            // Wrap YouTube template, break, and caption text in center tags
            transformedContent.push(
              new MediaWikiHTML(
                "center",
                [current, nextBreak, nextText],
                {},
                { collapsed: true }
              )
            );
            index += 2; // Skip the break and text we just processed
          } else {
            // Just wrap the YouTube template in center tags
            transformedContent.push(
              new MediaWikiHTML(
                "center",
                [current],
                {},
                { collapsed: true }
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