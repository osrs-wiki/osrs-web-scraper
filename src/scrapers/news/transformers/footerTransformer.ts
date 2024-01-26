import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiSeparator,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

class NewsFooterTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    const footerStartContent = content.filter((content) => {
      return (
        content instanceof MediaWikiText &&
        (content.value.startsWith("You can also discuss") ||
          content.value.startsWith("The Old School Team"))
      );
    });
    const footerStart = footerStartContent?.[0];
    if (footerStart) {
      const index = content.findIndex((content) => content == footerStart);
      if (index) {
        content.splice(index, 0, new MediaWikiSeparator());
        content.splice(index + 1, 0, new MediaWikiBreak());
        content.splice(index + 2, 0, new MediaWikiBreak());
      }
    }
    return content;
  }
}

export default NewsFooterTransformer;
