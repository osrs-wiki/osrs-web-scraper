import { MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import {
  formatUtcDateTime,
  formatUtcTime,
} from "../../../../../utils/datetime";
import { formatText } from "../../../../../utils/text";
import { ContentNodeParser } from "../types";

export const timeParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const utcOriginal = node.getAttribute("data-utc-original");
    if (utcOriginal) {
      const formatted =
        formatUtcTime(utcOriginal) ?? formatUtcDateTime(utcOriginal);
      if (formatted) {
        return new MediaWikiText(formatted);
      }
    }
  }
  return new MediaWikiText(formatText(node.rawText)?.trim());
};

export default timeParser;
