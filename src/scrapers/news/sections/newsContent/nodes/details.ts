import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
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
    const summaryNode = detailsElement.childNodes.find(
      (node) =>
        node instanceof HTMLElement &&
        (node as HTMLElement).rawTagName === "summary"
    );
    if (summaryNode && summaryNode instanceof HTMLElement) {
      const summaryElement = summaryNode as HTMLElement;
      content.push(
        new CollapedSectionTemplate(
          18,
          summaryElement.textContent.trim()
        ).build()
      );
    }
    detailsElement.childNodes
      .filter((node) => node != summaryNode)
      .forEach((contentNode) => {
        let results = undefined;
        if (contentNode instanceof HTMLElement) {
          results = nodeParser(contentNode, options);
        } else {
          results = textParser(contentNode, options);
        }
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
