import { MediaWikiHeader, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { formatText } from "../../../../../utils/text";
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

    // For h1-h4, return MediaWikiHeader
    if (typeof headerLevel === "number") {
      // Handle simple text content
      if (
        node.childNodes.length === 1 &&
        !(node.childNodes[0] instanceof HTMLElement)
      ) {
        return new MediaWikiHeader(formatText(node.rawText), headerLevel);
      }

      // Handle complex content with child nodes
      const childContent = node.childNodes
        .map((childNode) => {
          if (childNode instanceof HTMLElement) {
            return nodeParser(childNode, options);
          }
          return textParser(childNode, options);
        })
        .flat()
        .filter((content) => content != null);

      return new MediaWikiHeader(childContent, headerLevel);
    }

    // For h5 and h6, return formatted MediaWikiText
    if (headerLevel === "bold") {
      // Handle simple text content
      if (
        node.childNodes.length === 1 &&
        !(node.childNodes[0] instanceof HTMLElement)
      ) {
        return new MediaWikiText(formatText(node.rawText), {
          bold: true,
        });
      }

      // Handle complex content with child nodes
      const childContent = node.childNodes
        .map((childNode) => {
          if (childNode instanceof HTMLElement) {
            return nodeParser(childNode, options);
          }
          return textParser(childNode, options);
        })
        .flat()
        .filter((content) => content != null);

      return new MediaWikiText(childContent, {
        bold: true,
      });
    }

    if (headerLevel === "italic") {
      // Handle simple text content
      if (
        node.childNodes.length === 1 &&
        !(node.childNodes[0] instanceof HTMLElement)
      ) {
        return new MediaWikiText(formatText(node.rawText), {
          italics: true,
        });
      }

      // Handle complex content with child nodes
      const childContent = node.childNodes
        .map((childNode) => {
          if (childNode instanceof HTMLElement) {
            return nodeParser(childNode, options);
          }
          return textParser(childNode, options);
        })
        .flat()
        .filter((content) => content != null);

      return new MediaWikiText(childContent, {
        italics: true,
      });
    }
  }
};

export default headerParser;
