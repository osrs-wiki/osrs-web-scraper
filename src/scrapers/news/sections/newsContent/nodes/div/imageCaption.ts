import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

export const imageCaptionParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;

    // The "--empty" modifier marks a placeholder caption (rendered as a lone ".")
    // with no real caption text. Ignore it entirely so a real caption that follows
    // later in the markup (e.g. after a video) can still be picked up.
    if (element.classList.contains("image-caption--empty")) {
      return [];
    }

    // Parse child nodes (including text and links)
    const childContent = element.childNodes
      .map((childNode) => {
        if (childNode instanceof HTMLElement) {
          return nodeParser(childNode, options);
        }
        return textParser(childNode, options);
      })
      .flat()
      .filter((content) => content != null);
    return [
      new MediaWikiText(childContent, { italics: true }),
      new MediaWikiBreak(),
    ];
  }
  return textParser(node, options);
};

export default imageCaptionParser;
