import { MediaWikiBreak, MediaWikiHeader } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

const classToHeaderLevel: { [key: string]: number } = {
  "osrs-title": 2,
  "osrs-subtitle": 3,
  "osrs-subheading": 4,
};

export const osrsHeaderParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const className = element.classNames.trim().toLowerCase();
    const headerLevel = classToHeaderLevel[className];

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

    // Return MediaWiki header with appropriate level
    return [
      new MediaWikiHeader(childContent, headerLevel),
      new MediaWikiBreak(),
    ];
  }

  return textParser(node, options);
};

export default osrsHeaderParser;
