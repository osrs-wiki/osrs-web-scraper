import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const centerParser: ContentNodeParser = (node, options) => {
  return node.childNodes
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, { ...options, center: true });
      }
      return textParser(childNode, { ...options, center: true });
    })
    .flat();
};

export default centerParser;
