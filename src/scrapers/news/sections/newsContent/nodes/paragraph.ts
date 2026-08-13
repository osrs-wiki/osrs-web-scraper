import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import type { MediaWikiContent } from "@osrs-wiki/mediawiki-builder";

import textParser from "./text";
import { ContentNodeParser } from "../types";

// Recursively trims the leading/trailing whitespace-only text at the edge of a content tree,
// since source HTML often wraps paragraph text in newlines/indentation that would otherwise
// leak into the built wikitext as a stray leading space (which MediaWiki renders as <pre>).
function trimContentEdge(
  content: MediaWikiContent,
  edge: "start" | "end"
): void {
  if (!(content instanceof MediaWikiText)) {
    return;
  }
  if (typeof content.children === "string") {
    content.children =
      edge === "start"
        ? content.children.replace(/^\s+/, "")
        : content.children.replace(/\s+$/, "");
  } else if (Array.isArray(content.children) && content.children.length > 0) {
    const index = edge === "start" ? 0 : content.children.length - 1;
    trimContentEdge(content.children[index], edge);
  }
}

export const paragraphParser: ContentNodeParser = (node, options) => {
  const children = textParser(node, options);
  const childrenNodes = Array.isArray(children) ? children : [children];
  if (childrenNodes.length > 0) {
    trimContentEdge(childrenNodes[0], "start");
    trimContentEdge(childrenNodes[childrenNodes.length - 1], "end");
  }
  return [
    new MediaWikiText(childrenNodes),
    new MediaWikiBreak(),
    new MediaWikiBreak(),
  ];
};

export default paragraphParser;
