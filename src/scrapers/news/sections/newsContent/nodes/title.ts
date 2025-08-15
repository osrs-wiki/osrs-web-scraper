import { MediaWikiHeader } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import textParser from "./text";
import { ContentNodeParser } from "../types";

export const titleParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const tagName: string = node.rawTagName;
    const textContent = textParser(node, options);
    
    if (tagName === "smalltitle") {
      return new MediaWikiHeader(textContent, 3);
    } else if (tagName === "bigtitle") {
      return new MediaWikiHeader(textContent, 2);
    }
  }
};

export default titleParser;