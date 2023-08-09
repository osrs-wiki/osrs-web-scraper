import { MediaWikiContent } from "../../../utils/mediawiki";

export type PollSection = {
  format: (html: string, url: string) => Promise<MediaWikiContent[]>;
};
