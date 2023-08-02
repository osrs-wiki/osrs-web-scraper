import { HTMLElement } from "node-html-parser";

import { MediaWikiVideo } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const iframeParser: ContentNodeParser = (node) => {
  const htmlNode = node as HTMLElement;
  const link = htmlNode.attributes.src;
  return new MediaWikiVideo("test", link);
};

export default iframeParser;
