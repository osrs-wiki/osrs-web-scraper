import { HTMLElement } from "node-html-parser";

import {
  MediaWikiContent,
  MediaWikiExternalLink,
  MediaWikiText,
} from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const textParser: ContentNodeParser = (node) => {
  return node.childNodes
    .map<MediaWikiContent | MediaWikiContent[]>((childNode) => {
      if (childNode instanceof HTMLElement) {
        const element = childNode as HTMLElement;
        if (
          element.childNodes.length > 1 ||
          element.firstChild instanceof HTMLElement
        ) {
          return textParser(childNode);
        }
        const tagName = element.tagName?.toLowerCase();
        if (tagName === "a") {
          const link = childNode.attributes.href;
          return new MediaWikiExternalLink(childNode.rawText, link);
        }
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
