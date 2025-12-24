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

    const text = element.rawText.trim();

    // Skip empty anchor tags - they don't produce any content
    if (!text && element.childNodes.length === 0) {
      return;
    }

    if (link.endsWith("oldschool.runescape.wiki/")) {
      return new MediaWikiLink("Old School Wiki");
    }
    return new MediaWikiExternalLink(text, link);
  }
};

export default linkParser;
