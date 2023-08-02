import { Node } from "node-html-parser";

/**
 * Util function to prevent having to include ts-ignore every time rawTagName is referenced.
 * @param node
 * @returns
 */
export const getNodeTagName = (node: Node): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return node.rawTagName;
};
