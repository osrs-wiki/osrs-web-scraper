import { HTMLElement } from "node-html-parser";

import { MediaWikiContent } from "../../../utils/mediawiki";

export type PollSection = {
  format: (
    htmlElements: HTMLElement,
    url: string
  ) => Promise<MediaWikiContent[]>;
};
