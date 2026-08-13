import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";

import textParser from "./text";
import { trimContentEdges } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const paragraphParser: ContentNodeParser = (node, options) => {
  const children = textParser(node, options);
  const childrenNodes = Array.isArray(children) ? children : [children];
  trimContentEdges(childrenNodes);
  return [
    new MediaWikiText(childrenNodes),
    new MediaWikiBreak(),
    new MediaWikiBreak(),
  ];
};

export default paragraphParser;
