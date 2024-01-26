import { MediaWikiBreak } from "@osrs-wiki/mediawiki-builder";

import textParser from "./text";
import { ContentNodeParser } from "../types";

export const paragraphParser: ContentNodeParser = (node, options) => {
  const children = textParser(node, options);
  const childrenNodes = Array.isArray(children) ? children : [children];
  childrenNodes.push(new MediaWikiBreak());
  return childrenNodes;
};

export default paragraphParser;
