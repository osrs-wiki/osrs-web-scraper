import { HTMLElement } from "node-html-parser";

import textParser from "./text";
import { MediaWikiHeader } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const fontSizeHeaders: { [key: number]: number } = {
  22: 2,
  18: 3,
};

const REGEX_FONT_SIZE = /font-size:[ ]*([0-9]*)[a-z]*;/gm;

export const fontParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const fontSizeRaw = node.attributes.style.match(REGEX_FONT_SIZE)?.[0];
    const fontSize = fontSizeRaw
      ? parseInt(fontSizeRaw.replaceAll(/[^\d]*/g, ""))
      : undefined;
    return new MediaWikiHeader(
      textParser(node),
      fontSizeHeaders[fontSize ?? 22]
    );
  }
};

export default fontParser;
