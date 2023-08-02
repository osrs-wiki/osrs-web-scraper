import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const underlineParser: ContentNodeParser = (node, options) => {
  return node.childNodes
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, { ...options, underline: true });
      }
      return textParser(childNode, { ...options, underline: true });
    })
    .flat();
};

export default underlineParser;
