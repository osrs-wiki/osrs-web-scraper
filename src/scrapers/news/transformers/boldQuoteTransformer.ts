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
        
        // Check if this is bold text that needs transformation
        if (current instanceof MediaWikiText && current.styling?.bold) {
          let shouldTransform = false;
          let transformedText = current;
          
          // Case 1: Bold text surrounded by separate quote elements
          if (index > 0 && index < content.length - 1) {
            const before = content[index - 1];
            const after = content[index + 1];
            
            if (
              before instanceof MediaWikiText &&
              after instanceof MediaWikiText &&
              typeof before.children === "string" &&
              typeof after.children === "string" &&
              before.children.endsWith("'") &&
              after.children.startsWith("'")
            ) {
              shouldTransform = true;
            }
          }
          
          // Case 2: Bold text that itself contains surrounding quotes
          if (!shouldTransform) {
            const textContent = extractTextContent(current);
            if (textContent.startsWith("'") && textContent.endsWith("'") && textContent.length > 2) {
              shouldTransform = true;
            }
          }
          
          if (shouldTransform) {
            // Replace the bold MediaWiki formatting with HTML <b> tags
            const boldContent = extractTextContent(current);
            transformedText = new MediaWikiText(`<b>${boldContent}</b>`);
          }
          
          transformedContent.push(transformedText);
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