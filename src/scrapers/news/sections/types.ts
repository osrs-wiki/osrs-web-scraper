import { MediaWikiContent } from "../../../utils/mediawiki";

export type NewsSection = {
  format: (html: string, url: string, title: string) => MediaWikiContent[];
};
