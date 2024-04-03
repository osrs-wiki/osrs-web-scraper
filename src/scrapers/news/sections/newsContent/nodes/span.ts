import textParser from "./text";
import { ContentNodeParser } from "../types";

export const spanParser: ContentNodeParser = (node, options) => {
  const children = textParser(node, options);
  const childrenNodes = Array.isArray(children) ? children : [children];
  return childrenNodes;
};

export default spanParser;
