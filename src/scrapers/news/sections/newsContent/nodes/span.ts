import { MediaWikiContent, MediaWikiHTML } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import textParser from "./text";
import { ContentNodeParser } from "../types";

const REGEX_FONT_COLOR = /color:[ ]*\#([\d\w]*)/;

export const spanParser: ContentNodeParser = (node, options) => {
  let spanNodes: MediaWikiContent[] = [];
  const children = textParser(node, options);
  spanNodes = Array.isArray(children) ? children : [children];
  if (node instanceof HTMLElement && node.attributes?.style) {
    const fontColorRaw = node.attributes.style.match(REGEX_FONT_COLOR)?.[1];
    if (fontColorRaw) {
      const spanNode = new MediaWikiHTML(
        "span",
        spanNodes,
        {
          color: `#${fontColorRaw}`,
        },
        { collapsed: true }
      );
      spanNodes = [spanNode];
    }
  }
  return spanNodes;
};

export default spanParser;
