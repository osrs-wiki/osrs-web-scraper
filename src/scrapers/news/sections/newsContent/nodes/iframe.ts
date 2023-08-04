import { HTMLElement } from "node-html-parser";

import { MediaWikiVideo } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const iframeParser: ContentNodeParser = (node) => {
  const htmlNode = node as HTMLElement;
  const link = htmlNode.attributes["data-cookieblock-src"];
  return new MediaWikiVideo("title", link);
};

export default iframeParser;
