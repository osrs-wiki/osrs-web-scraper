import { Node } from "node-html-parser";

import { MediaWikiContent } from "../../../../utils/mediawiki";

export type ContentNodeParser = (
  node: Node
) => MediaWikiContent | MediaWikiContent[];
