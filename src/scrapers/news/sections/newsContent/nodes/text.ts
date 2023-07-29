import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import {
  MediaWikiContent,
  MediaWikiText,
} from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const textParser: ContentNodeParser = (node) => {
  return node.childNodes
    .map<MediaWikiContent | MediaWikiContent[]>((childNode) => {
      if (childNode instanceof HTMLElement) {
        const element = childNode as HTMLElement;
        if (
          element.childNodes.length > 0 &&
          element.firstChild instanceof HTMLElement
        ) {
          return nodeParser(childNode);
        }
        const tagName = element.tagName?.toLowerCase();
        return new MediaWikiText(childNode.rawText, {
          bold: tagName === "b",
          italics: tagName === "i",
          underline: tagName === "u",
        });
      } else {
        return new MediaWikiText(childNode.rawText);
      }
    })
    .flat();
};

export default textParser;
