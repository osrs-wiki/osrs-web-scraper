import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiFile,
  MediaWikiText,
  MediaWikiTransformer,
} from "../../../utils/mediawiki";

class NewsImageCaptionTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    if (content.length < 4) {
      return content;
    }
    const transformedContent = [];
    for (let index = 0; index < content.length; index++) {
      const current = content[index];
      if (current instanceof MediaWikiFile && index < content.length - 2) {
        const first = content[index + 1];
        const second = content[index + 2];
        if (
          first instanceof MediaWikiBreak &&
          second instanceof MediaWikiText &&
          second.styling?.italics
        ) {
          transformedContent.push(
            new MediaWikiFile(current.fileName, {
              ...current.options,
              caption: second,
            })
          );
          index += 2;
        } else {
          transformedContent.push(current);
        }
      } else {
        transformedContent.push(current);
      }
    }
    return transformedContent;
  }
}

export default NewsImageCaptionTransformer;
