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
  /**
   * Recursively transforms bold text with quotes in nested content
   */
  private transformNestedContent(content: MediaWikiContent[]): MediaWikiContent[] {
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
            // For this case, we want to extract the inner content and put quotes outside
            const innerContent = textContent.slice(1, -1); // Remove quotes from content
            transformedText = new MediaWikiText(`'<b>${innerContent}</b>'`);
          }
        }
        
        // Case 1: Bold text surrounded by separate quote elements (only if not already transformed in case 2)
        if (shouldTransform && transformedText === current) {
          // Replace the bold MediaWiki formatting with HTML <b> tags
          const boldContent = extractTextContent(current);
          transformedText = new MediaWikiText(`<b>${boldContent}</b>`);
        }
        
        transformedContent.push(transformedText);
      } else if (current instanceof MediaWikiText && Array.isArray(current.children)) {
        // Case 3: MediaWikiText with children - recursively process them
        const transformedChildren = this.transformNestedContent(current.children);
        const newMediaWikiText = new MediaWikiText(transformedChildren, current.styling);
        transformedContent.push(newMediaWikiText);
      } else {
        transformedContent.push(current);
      }
    }
    
    return transformedContent;
  }

  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    try {
      return this.transformNestedContent(content);
    } catch (error) {
      console.error("Error transforming bold quotes:", error);
      return content;
    }
  }
}

export default NewsBoldQuoteTransformer;