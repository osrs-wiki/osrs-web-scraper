import MediaWikiContent from "./content";

abstract class MediaWikiTransformer {
  abstract transform(content: MediaWikiContent[]): MediaWikiContent[];
}

export default MediaWikiTransformer;
