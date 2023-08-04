import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import {
  MediaWikiContent,
  MediaWikiText,
} from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const textParser: ContentNodeParser = (node, options) => {
  if (node.childNodes.length === 0) {
    return new MediaWikiText(node.rawText, {
      bold: options?.bold as boolean,
      italics: options?.italics as boolean,
      underline: options?.underline as boolean,
    });
  }
  return node.childNodes
    .map<MediaWikiContent | MediaWikiContent[]>((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode);
      } else {
        return new MediaWikiText(childNode.rawText, {
          bold: options?.bold as boolean,
          italics: options?.italics as boolean,
          underline: options?.underline as boolean,
        });
      }
    })
    .flat();
};

export default textParser;
