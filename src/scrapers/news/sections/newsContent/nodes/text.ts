import { MediaWikiContent, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import { formatText } from "../../../../../utils/text";
import { ContentNodeParser } from "../types";

const textParser: ContentNodeParser = (node, options) => {
  if (node.childNodes.length === 0) {
    if (node.rawText.trim().length === 0) {
      return undefined;
    }
    return new MediaWikiText(formatText(node.rawText), {
      bold: options?.bold as boolean,
      italics: options?.italics as boolean,
      underline: options?.underline as boolean,
    });
  }
  return node.childNodes
    .map<MediaWikiContent | MediaWikiContent[]>((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, options);
      }
      return new MediaWikiText(formatText(childNode.rawText), {
        bold: options?.bold as boolean,
        italics: options?.italics as boolean,
        underline: options?.underline as boolean,
      });
    })
    .flat()
    .filter((content) => content != null);
};

export default textParser;
