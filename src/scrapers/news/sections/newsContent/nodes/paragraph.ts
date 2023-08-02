import textParser from "./text";
import { MediaWikiBreak } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const paragraphParser: ContentNodeParser = (node, options) => {
  const children = textParser(node, options);
  const childrenNodes = Array.isArray(children) ? children : [children];
  childrenNodes.push(new MediaWikiBreak());
  return childrenNodes;
};

export default paragraphParser;
