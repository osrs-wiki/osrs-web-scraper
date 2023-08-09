import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

export const listParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const list = node as HTMLElement;
    const ordered = list.tagName === "ol";
    const level = ((options.level as number) ?? 0) + 1;
    return node.childNodes
      .filter((childNode) => childNode instanceof HTMLElement)
      .map((childNode) => {
        if (childNode instanceof HTMLElement) {
          return nodeParser(childNode, {
            ...options,
            ordered,
            level,
          });
        }
        return textParser(childNode, { ...options, ordered, level });
      })
      .flat();
  }
};

export default listParser;
