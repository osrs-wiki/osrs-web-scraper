import {
  MediaWikiContent,
  MediaWikiExternalLink,
  MediaWikiFile,
  MediaWikiText,
  MediaWikiTransformer,
} from "@osrs-wiki/mediawiki-builder";

import { getNextContent, trim } from "../../../utils/mediawiki";

// Videos are frequently embedded directly within narrative/interview body text,
// where the following paragraph is ordinary prose rather than a real caption
// (unlike standalone showcase images, e.g. "Creative Corner" art, where the
// following paragraph is conventionally its caption). So for videos, only treat
// the following content as a caption if it's italicised (e.g. an "image-caption"
// div or a `<center><i>` block) rather than merging any plain paragraph.
const videoFileExtensionPattern = /\.(mp4|mov|webm|avi)$/i;

const isItalicCaption = (content: MediaWikiText): boolean => {
  if (content.styling?.italics) {
    return true;
  }
  if (Array.isArray(content.children) && content.children.length === 1) {
    const [child] = content.children;
    return child instanceof MediaWikiText && !!child.styling?.italics;
  }
  return false;
};

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
          const nextLink = content[next.index + 1];
          const nextLinkText = content[next.index + 2];

          if (
            next.content instanceof MediaWikiText &&
            nextLink instanceof MediaWikiExternalLink &&
            nextLinkText instanceof MediaWikiText
          ) {
            // A fallback caption (e.g. from an "osrs-embed__fallback" div, in the
            // form of text + link + text) follows the file.
            transformedContent.push(
              new MediaWikiFile(current.fileName, {
                ...current.options,
                format: "thumb",
                caption: new MediaWikiText([
                  next.content,
                  nextLink,
                  nextLinkText,
                ]),
              })
            );
            index = next.index + 2;
          } else if (
            next.content instanceof MediaWikiText &&
            Array.isArray(next.content.children) &&
            (isItalicCaption(next.content) ||
              !videoFileExtensionPattern.test(current.fileName))
          ) {
            // A fully-formed caption (e.g. from an "image-caption" div) follows the
            // file, so it takes precedence over any caption already set on the file
            // (which may be a truncated `data-caption-text` attribute value).
            // Preserve any styling (e.g. italics) on the caption content itself, in
            // case it isn't wrapped in an unstyled outer MediaWikiText (e.g. a
            // top-level `<center>` caption not nested inside a `<p>`).
            transformedContent.push(
              new MediaWikiFile(current.fileName, {
                ...current.options,
                format: "thumb",
                caption: new MediaWikiText(
                  trim(next.content.children),
                  next.content.styling
                ),
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
