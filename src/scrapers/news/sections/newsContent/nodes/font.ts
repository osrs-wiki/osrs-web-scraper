import { HTMLElement } from "node-html-parser";

import { MediaWikiHeader } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const fontParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    return new MediaWikiHeader(element.rawText, 2);
  }
};

export default fontParser;
