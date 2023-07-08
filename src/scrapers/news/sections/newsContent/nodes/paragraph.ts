import { HTMLElement } from "node-html-parser";

import {
  MediaWikiContent,
  MediaWikiText,
} from "../../../../../utils/mediawiki";
import { getNodeTagName } from "../../../../../utils/nodes";
import { ContentNodeParser } from "../types";

const paragraphParser: ContentNodeParser = (node) => {
  return node.childNodes.map<MediaWikiContent>((childNode) => {
    if (node instanceof HTMLElement) {
      const element = node as HTMLElement;
      const tagName = element.tagName;
      const nextChildNode = childNode.childNodes?.[0];
      const childTagName = nextChildNode ? getNodeTagName(nextChildNode) : "";
      return new MediaWikiText(node.rawText, {
        bold: tagName === "b" || childTagName === "b",
        italics: tagName === "i" || childTagName === "i",
        underline: tagName === "u" || childTagName === "u",
      });
    } else {
      return new MediaWikiText(node.rawText);
    }
  });
};

export default paragraphParser;
