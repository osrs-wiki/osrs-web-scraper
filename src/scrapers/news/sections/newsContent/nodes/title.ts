import { MediaWikiHeader } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import textParser from "./text";
import { ContentNodeParser } from "../types";

const tagNameMap: { [key: string]: number } = {
  smalltitle: 3,
  bigtitle: 2,
};

export const titleParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const tagName: string = node.rawTagName;
    const textContent = textParser(node, options);

    if (tagNameMap[tagName]) {
      return new MediaWikiHeader(textContent, tagNameMap[tagName]);
    } else {
      return textContent;
    }
  }
};

export default titleParser;
