import { MediaWikiBreak, MediaWikiText, MediaWikiListItem } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const listParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const list = node as HTMLElement;
    const ordered = list.rawTagName === "ol";
    const level = ((options?.level as number) ?? 0) + 1;
    const content = node.childNodes
      .filter(
        (childNode) =>
          childNode instanceof HTMLElement && childNode.rawTagName !== "br"
      )
      .map((childNode) => {
        if (childNode instanceof HTMLElement) {
          return nodeParser(childNode, {
            ...options,
            ordered,
            level,
          });
        }
        return textParser(childNode, { ...options, ordered, level });
      })
      .flat();
    
    // For top-level lists, convert the first MediaWikiListItem to MediaWikiText
    // to avoid the automatic leading newline that MediaWikiListItem adds
    if (!options?.level && content.length > 0 && content[0] instanceof MediaWikiListItem) {
      const firstItem = content[0];
      // Build the first item to get its content, then create a MediaWikiText
      const firstItemText = firstItem.build();
      // Remove the leading newline from the built text
      const textContent = firstItemText.startsWith("\n") ? firstItemText.slice(1) : firstItemText;
      content[0] = new MediaWikiText(textContent);
    }
    
    if (!options?.level) {
      content.push(new MediaWikiBreak());
      content.push(new MediaWikiBreak());
    }
    return content;
  }
};

export default listParser;
