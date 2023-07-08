import { parse } from "node-html-parser";

import { nodeParser } from "./nodes";
import { MediaWikiContent } from "../../../../utils/mediawiki";
import { getNodeTagName } from "../../../../utils/nodes";
import { NewsSection } from "../types";

export type ContentSection = NewsSection & {
  title: string;
};

const ignoredTags = ["br", "style"];

const newsContent: NewsSection = {
  format: (html, url, title) => {
    const contentRoot = parse(html);

    const content: MediaWikiContent[] = [];

    contentRoot.childNodes.forEach((node) => {
      const tag = getNodeTagName(node);
      if (ignoredTags.includes(tag) || tag === undefined) {
        return;
      }
      const result = nodeParser(node);
      if (Array.isArray(result)) {
        content.concat(result);
      } else {
        content.push(result);
      }
    });

    return content;
  },
};

export default newsContent;
