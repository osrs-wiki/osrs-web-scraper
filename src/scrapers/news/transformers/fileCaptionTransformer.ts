import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiExternalLink,
  MediaWikiFile,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

class NewsFileCaptionTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    if (content.length < 3) {
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
          const captionContents = [second];
          let captionIndex = index + 4;
          if (index < content.length - 3) {
            captionIndex--;
            do {
              if (!(content[captionIndex] instanceof MediaWikiBreak)) {
                captionContents.push(content[captionIndex]);
              }
              captionIndex++;
            } while (
              content[captionIndex] instanceof MediaWikiBreak ||
              content[captionIndex] instanceof MediaWikiExternalLink ||
              (content[captionIndex] instanceof MediaWikiText &&
                (content[captionIndex] as MediaWikiText).styling?.italics)
            );
          }
          transformedContent.push(
            new MediaWikiFile(current.fileName, {
              ...current.options,
              format: "thumb",
              caption: captionContents,
            })
          );
          transformedContent.push(new MediaWikiBreak());
          index += captionIndex - index - 2;
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

export default NewsFileCaptionTransformer;
