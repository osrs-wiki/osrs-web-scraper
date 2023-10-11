import { HTMLElement } from "node-html-parser";

import textParser from "./text";
import { MediaWikiHeader } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const fontParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    return new MediaWikiHeader(textParser(node), 2);
  }
};

export default fontParser;
