import { MediaWikiHeader, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

const tagNameMap: { [key: string]: number | "bold" | "italic" } = {
  h1: 2,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: "bold",
  h6: "italic",
};

export const headerParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const tagName: string = node.rawTagName;
    const headerLevel = tagNameMap[tagName];

    if (headerLevel === undefined) {
      return textParser(node, options);
    }

    // Parse child nodes
    const childContent = node.childNodes
      .map((childNode) => {
        if (childNode instanceof HTMLElement) {
          return nodeParser(childNode, options);
        }
        return textParser(childNode, options);
      })
      .flat()
      .filter((content) => content != null);

    // Return appropriate MediaWiki element based on header level
    if (typeof headerLevel === "number") {
      return new MediaWikiHeader(childContent, headerLevel);
    } else if (headerLevel === "bold") {
      return new MediaWikiText(childContent, {
        bold: true,
      });
    } else if (headerLevel === "italic") {
      return new MediaWikiText(childContent, {
        italics: true,
      });
    }
  }
};

export default headerParser;
