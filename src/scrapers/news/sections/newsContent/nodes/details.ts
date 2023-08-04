import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import {
  CollapedSectionTemplate,
  MediaWikiContent,
  MediaWikiTemplate,
} from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const detailsParser: ContentNodeParser = (node, options) => {
  let content: MediaWikiContent[] = [];
  if (node instanceof HTMLElement) {
    const detailsElement = node as HTMLElement;
    const summaryNode = detailsElement.firstChild;
    if (summaryNode && summaryNode instanceof HTMLElement) {
      const summaryElement = summaryNode as HTMLElement;
      content.push(
        new CollapedSectionTemplate(18, summaryElement.textContent).build()
      );
    }
    detailsElement.childNodes.shift();
    detailsElement.childNodes.forEach((contentNode) => {
      const results = nodeParser(contentNode, options);
      if (Array.isArray(results)) {
        content = content.concat(results);
      } else {
        content.push(results);
      }
    });
    content.push(new MediaWikiTemplate("Collapsed section end"));
    return content;
  }
};

export default detailsParser;
