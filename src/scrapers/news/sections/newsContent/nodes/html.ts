import { MediaWikiContent, MediaWikiHTML } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import textParser from "./text";
import { ContentNodeParser } from "../types";

export const htmlParser: ContentNodeParser = (node, options) => {
  let childrenContent: MediaWikiContent[] = [];
  const children = textParser(node, options);
  childrenContent = Array.isArray(children) ? children : [children];
  let htmlNode: MediaWikiContent[] = undefined;
  if (node instanceof HTMLElement) {
    htmlNode = [
      new MediaWikiHTML(
        node.tagName?.toLocaleLowerCase(),
        childrenContent,
        {},
        { collapsed: true }
      ),
    ];
  }
  return htmlNode;
};

export default htmlParser;
