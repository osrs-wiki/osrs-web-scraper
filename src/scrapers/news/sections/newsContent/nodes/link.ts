import {
  MediaWikiExternalLink,
  MediaWikiLink,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import { ContentNodeParser } from "../types";

export const linkParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const link = element.attributes.href;
    if (!link) {
      return;
    }
    if (
      element.childNodes.length > 1 ||
      element.firstChild instanceof HTMLElement
    ) {
      return element.childNodes
        .map((childNode) => nodeParser(childNode, { ...options, link }))
        .flat();
    }
    if (link.endsWith("oldschool.runescape.wiki/")) {
      return new MediaWikiLink("Old School Wiki");
    }
    return new MediaWikiExternalLink(element.rawText, link);
  }
};

export default linkParser;
