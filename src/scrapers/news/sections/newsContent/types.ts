import { Node } from "node-html-parser";

import { MediaWikiContent } from "../../../../utils/mediawiki";

export type ContentNodeParser = (
  node: Node,
  options?: { [key: string]: string | boolean | number }
) => MediaWikiContent | MediaWikiContent[];
