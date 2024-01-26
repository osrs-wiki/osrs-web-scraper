import { MediaWikiComment } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import imageParser from "./image";
import { ContentNodeParser } from "../types";

export const videoParser: ContentNodeParser = (node, { title }) => {
  const firstNode = node.childNodes.filter(
    (node) => node instanceof HTMLElement
  )?.[0];
  if (node instanceof HTMLElement && firstNode instanceof HTMLElement) {
    const source = firstNode as HTMLElement;
    const width = node.attributes.width
      ? parseInt(node.attributes.width)
      : undefined;
    return imageParser(source, { title, width });
  }
  return new MediaWikiComment("Invalid video node");
};

export default videoParser;
