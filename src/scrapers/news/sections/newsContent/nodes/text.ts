import { MediaWikiContent, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import { formatText } from "../../../../../utils/text";
import { ContentNodeParser } from "../types";

const textParser: ContentNodeParser = (node, options) => {
  if (node.childNodes.length === 0) {
    // Decorative markup (e.g. a lone "&nbsp;" used for visual indentation) formats
    // down to nothing, so check emptiness after formatting rather than on the raw text.
    const formatted = formatText(node.rawText);
    if (!formatted || formatted.trim().length === 0) {
      return undefined;
    }
    return new MediaWikiText(formatted, {
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
      const formatted = formatText(childNode.rawText);
      if (!formatted || formatted.trim().length === 0) {
        return undefined;
      }
      return new MediaWikiText(formatted, {
        bold: options?.bold as boolean,
        italics: options?.italics as boolean,
        underline: options?.underline as boolean,
      });
    })
    .flat()
    .filter((content) => content != null);
};

export default textParser;
