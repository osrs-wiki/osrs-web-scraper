import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";

import textParser from "./text";
import { ContentNodeParser } from "../types";

export const paragraphParser: ContentNodeParser = (node, options) => {
  const children = textParser(node, options);
  const childrenNodes = Array.isArray(children) ? children : [children];
  return [new MediaWikiText(childrenNodes), new MediaWikiBreak()];
};

export default paragraphParser;
