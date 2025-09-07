import {
  MediaWikiContent,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

/**
 * Extracts the text content from a MediaWikiText object, handling both string and nested content
 */
const extractTextContent = (mediaWikiText: MediaWikiText): string => {
  if (typeof mediaWikiText.children === "string") {
    return mediaWikiText.children;
  }
  // For complex content, build it and strip MediaWiki bold formatting
  return mediaWikiText.build().replace(/'''/g, "");
};

class NewsBoldQuoteTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    try {
      const transformedContent = [];
      
      for (let index = 0; index < content.length; index++) {
        const current = content[index];
        
        // Look for pattern: quote + bold text + quote
        if (
          index > 0 &&
          index < content.length - 1 &&
          current instanceof MediaWikiText &&
          current.styling?.bold
        ) {
          const before = content[index - 1];
          const after = content[index + 1];
          
          // Check if the bold text is surrounded by single quotes
          if (
            before instanceof MediaWikiText &&
            after instanceof MediaWikiText &&
            typeof before.children === "string" &&
            typeof after.children === "string" &&
            before.children.endsWith("'") &&
            after.children.startsWith("'")
          ) {
            // Replace the bold MediaWiki formatting with HTML <b> tags
            const boldContent = extractTextContent(current);
            const htmlBoldText = new MediaWikiText(`<b>${boldContent}</b>`);
            transformedContent.push(htmlBoldText);
          } else {
            transformedContent.push(current);
          }
        } else {
          transformedContent.push(current);
        }
      }
      
      return transformedContent;
    } catch (error) {
      console.error("Error transforming bold quotes:", error);
      return content;
    }
  }
}

export default NewsBoldQuoteTransformer;