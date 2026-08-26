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
   * Recursively transforms bold text with quotes in nested content.
   *
   * Quotes adjacent to a bold run's ''' delimiters produce malformed wikitext
   * (e.g. ''''text'''), so any such quote is stripped and re-emitted as a plain
   * quote character outside a <b> tag instead. The quote can live either inside
   * the bold node's own text (e.g. <b>'text'</b>) or in a sibling text node
   * right next to the bold node (e.g. '<b>text</b>), and either side can be
   * present independently of the other.
   */
  private transformNestedContent(
    content: MediaWikiContent[]
  ): MediaWikiContent[] {
    const transformedContent: MediaWikiContent[] = [];

    for (let index = 0; index < content.length; index++) {
      const current = content[index];

      if (current instanceof MediaWikiText && current.styling?.bold) {
        const boldText = extractTextContent(current);
        const before = content[index - 1];
        const after = content[index + 1];

        const internalLeading = boldText.length > 1 && boldText.startsWith("'");
        const internalTrailing = boldText.length > 1 && boldText.endsWith("'");
        const externalLeading =
          !internalLeading &&
          before instanceof MediaWikiText &&
          typeof before.children === "string" &&
          before.children.endsWith("'");
        const externalTrailing =
          !internalTrailing &&
          after instanceof MediaWikiText &&
          typeof after.children === "string" &&
          after.children.startsWith("'");

        if (
          internalLeading ||
          internalTrailing ||
          externalLeading ||
          externalTrailing
        ) {
          const innerText = boldText.slice(
            internalLeading ? 1 : 0,
            internalTrailing ? -1 : undefined
          );

          if (internalLeading) {
            transformedContent.push(new MediaWikiText("'"));
          }
          transformedContent.push(new MediaWikiText(`<b>${innerText}</b>`));
          if (internalTrailing) {
            transformedContent.push(new MediaWikiText("'"));
          }
          continue;
        }

        transformedContent.push(current);
      } else if (
        current instanceof MediaWikiText &&
        Array.isArray(current.children)
      ) {
        // MediaWikiText with children - recursively process them
        const transformedChildren = this.transformNestedContent(
          current.children
        );
        const newMediaWikiText = new MediaWikiText(
          transformedChildren,
          current.styling
        );
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
