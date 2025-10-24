import { MediaWikiListItem } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const listItemParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const ordered = (options?.ordered as boolean) ?? false;
    const childNodes = node.childNodes
      .map((childNode) => {
        if (childNode instanceof HTMLElement) {
          return nodeParser(childNode, { ...options, ordered });
        }
        return textParser(childNode, { ...options, ordered });
      })
      .flat();
    return new MediaWikiListItem(childNodes, {
      ordered, // Use the ordered value from parent list
      level: (options?.level as number) ?? 1, // Default to level 1
    });
  }
};

export default listItemParser;
