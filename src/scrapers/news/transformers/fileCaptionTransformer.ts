import {
  MediaWikiContent,
  MediaWikiFile,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

import { getNextContent, trim } from "../../../utils/mediawiki";

class NewsFileCaptionTransformer extends MediaWikiTransformer {
  transform(content: MediaWikiContent[]): MediaWikiContent[] {
    if (content.length < 2) {
      return content;
    }
    try {
      const transformedContent = [];
      for (let index = 0; index < content.length; index++) {
        const current = content[index];
        if (current instanceof MediaWikiFile) {
          const next = getNextContent(content, index + 1);
          if (
            next.content instanceof MediaWikiText &&
            Array.isArray(next.content.children)
          ) {
            // A fully-formed caption (e.g. from an "image-caption" div) follows the
            // file, so it takes precedence over any caption already set on the file
            // (which may be a truncated `data-caption-text` attribute value).
            transformedContent.push(
              new MediaWikiFile(current.fileName, {
                ...current.options,
                format: "thumb",
                caption: new MediaWikiText(trim(next.content.children)),
              })
            );
            index = next.index;
          } else {
            transformedContent.push(current);
          }
        } else {
          transformedContent.push(current);
        }
      }
      return transformedContent;
    } catch (error) {
      console.error("Error transforming file caption:", error);
      return content;
    }
  }
}

export default NewsFileCaptionTransformer;
