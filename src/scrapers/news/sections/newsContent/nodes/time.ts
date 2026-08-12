import { MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { ContentNodeParser } from "../types";

const REGEX_UTC_TIME = /^(\d{1,2}):(\d{2})\s*(UTC)$/i;

function formatUtcTime(utcOriginal: string): string | null {
  const match = utcOriginal.match(REGEX_UTC_TIME);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${suffix} UTC`;
}

export const timeParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const utcOriginal = node.getAttribute("data-utc-original");
    if (utcOriginal) {
      const formatted = formatUtcTime(utcOriginal);
      if (formatted) {
        return new MediaWikiText(formatted);
      }
    }
  }
  return new MediaWikiText(node.rawText.trim());
};

export default timeParser;
