import { MediaWikiBreak } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const listParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const list = node as HTMLElement;
    const ordered = list.tagName === "ol";
    const level = ((options?.level as number) ?? 0) + 1;
    const content = node.childNodes
      .filter((childNode) => childNode instanceof HTMLElement)
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
    if (!options?.level) {
      content.push(new MediaWikiBreak());
    }
    return content;
  }
};

export default listParser;
