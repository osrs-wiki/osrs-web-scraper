import { MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import {
  formatUtcDateTime,
  formatUtcDateTimeRange,
  formatUtcTime,
} from "../../../../../utils/datetime";
import { formatText } from "../../../../../utils/text";
import { ContentNodeParser } from "../types";

export const timeParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const utcOriginal = node.getAttribute("data-utc-original");
    const endTime = node.getAttribute("data-end-time");
    if (utcOriginal) {
      const formatted =
        (endTime && formatUtcDateTimeRange(utcOriginal, endTime)) ||
        formatUtcTime(utcOriginal) ||
        formatUtcDateTime(utcOriginal);
      if (formatted) {
        return new MediaWikiText(formatted);
      }
    }
  }
  return new MediaWikiText(formatText(node.rawText)?.trim());
};

export default timeParser;
