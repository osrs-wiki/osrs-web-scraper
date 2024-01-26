import { MediaWikiContent } from "@osrs-wiki/mediawiki-builder";
import { Node } from "node-html-parser";

export type ContentNodeParser = (
  node: Node,
  options?: { [key: string]: string | boolean | number }
) => MediaWikiContent | MediaWikiContent[];
