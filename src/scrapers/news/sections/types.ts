import { MediaWikiContent } from "@osrs-wiki/mediawiki-builder";

export type NewsSection = {
  format: (
    html: string,
    url: string,
    title: string
  ) => Promise<MediaWikiContent[]>;
};
