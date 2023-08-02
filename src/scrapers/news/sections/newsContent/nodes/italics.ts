import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const italicsParser: ContentNodeParser = (node, options) => {
  return node.childNodes
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, { ...options, italics: true });
      }
      return textParser(childNode, { ...options, italics: true });
    })
    .flat();
};

export default italicsParser;
