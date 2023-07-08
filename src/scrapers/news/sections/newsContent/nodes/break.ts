import { MediaWikiBreak } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const breakParser: ContentNodeParser = () => {
  return new MediaWikiBreak();
};

export default breakParser;
