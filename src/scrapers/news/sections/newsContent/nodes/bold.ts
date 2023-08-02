import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const boldParser: ContentNodeParser = (node, options) => {
  return node.childNodes
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, { ...options, bold: true });
      }
      return textParser(childNode, { ...options, bold: true });
    })
    .flat();
};

export default boldParser;
