import { MediaWikiListItem } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const listItemParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const list = node as HTMLElement;
    const ordered = list.tagName === "ol";
    const childNodes = node.childNodes
      .map((childNode) => {
        if (childNode instanceof HTMLElement) {
          return nodeParser(childNode, { ...options, ordered });
        }
        return textParser(childNode, { ...options, ordered });
      })
      .flat();
    return new MediaWikiListItem(childNodes, {
      ordered: (options?.ordered as boolean) ?? false, // Default to unordered (bullet point)
      level: (options?.level as number) ?? 1, // Default to level 1
    });
  }
};

export default listItemParser;
