import { MediaWikiContent } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

export type PollSection = {
  format: (
    htmlElements: HTMLElement,
    url: string
  ) => Promise<MediaWikiContent[]>;
};
