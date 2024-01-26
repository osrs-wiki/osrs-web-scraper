import { MediaWikiBreak } from "@osrs-wiki/mediawiki-builder";

import { ContentNodeParser } from "../types";

export const breakParser: ContentNodeParser = () => {
  return new MediaWikiBreak();
};

export default breakParser;
