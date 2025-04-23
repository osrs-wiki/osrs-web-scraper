import { MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { formatText } from "../../../../../utils/text";
import { ContentNodeParser } from "../types";

export const italicsParser: ContentNodeParser = (node, options) => {
  if (
    node.childNodes.length === 1 &&
    !(node.childNodes[0] instanceof HTMLElement)
  ) {
    return new MediaWikiText(formatText(node.rawText), {
      italics: true,
    });
  }
  const childContent = node.childNodes
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, options);
      }
      return textParser(childNode, options);
    })
    .flat();

  return new MediaWikiText(childContent, {
    italics: true,
  });
};

export default italicsParser;
