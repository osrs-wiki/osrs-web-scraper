import {
  MediaWikiBreak,
  MediaWikiComment,
  MediaWikiExternalLink,
  MediaWikiFile,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import sizeOf from "image-size";
import { HTMLElement } from "node-html-parser";

import {
  formatFileName,
  getFileExtension,
  findFileByBaseName,
} from "../../../../../utils/file";
import { ContentContext } from "../newsContent";
import { ContentNodeParser } from "../types";

const ignoredClasses = ["demo cursor"];
const imageExtensions = ["png", "jpg", "gif"];
const REGEX_WIDTH_DECLARATION = /^width\s*:\s*([0-9]+)/i;

export const imageParser: ContentNodeParser = (
  node,
  { title, center, link, width }
) => {
  if (node instanceof HTMLElement) {
    const image = node as HTMLElement;
    const imageLink = image.attributes.src ?? image.attributes.href;

    if (
      imageLink.endsWith("hr.png") ||
      ignoredClasses.includes(image.classNames.trim())
    ) {
      return undefined;
    }

    const formattedTitle = formatFileName(title as string);
    const imageDirectory = `./out/news/${formattedTitle}`;
    if (!fs.existsSync(imageDirectory)) {
      fs.mkdirSync(imageDirectory, { recursive: true });
    }

    const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
    const imageExtension = getFileExtension(imageLink);

    // Check if the file exists with a different extension (due to MIME type correction)
    const actualFileName = findFileByBaseName(imageDirectory, imageName);
    const fileNameToUse = actualFileName || `${imageName}.${imageExtension}`;

    let dimensions;
    try {
      // Only match a `width` declaration itself, not `max-width`/`min-width`/`border-width` etc.
      const styleWidth = image.attributes.style
        ?.split(";")
        .map((declaration) => declaration.trim())
        .find((declaration) => REGEX_WIDTH_DECLARATION.test(declaration))
        ?.match(REGEX_WIDTH_DECLARATION)?.[1];
      const explicitWidth =
        image.attributes.width ?? image.attributes["data-width"] ?? styleWidth;

      if (explicitWidth) {
        dimensions = { width: parseInt(explicitWidth) };
      } else {
        // Try to find the image file, which might have a corrected extension
        if (
          actualFileName &&
          imageExtensions.some((ext) => actualFileName.endsWith(`.${ext}`))
        ) {
          const actualFilePath = `${imageDirectory}/${actualFileName}`;
          dimensions = sizeOf(actualFilePath);
        }
      }
    } catch (error) {
      console.error(`Error retrieving image size for ${imageName}:`, error);
    }

    const captionLink =
      image.attributes["data-caption-link"] ??
      image.attributes["data-caption-href"];
    const captionText = image.attributes["data-caption-text"]; /* ?? [
      new MediaWikiText("If you can't see the asset above, "),
      new MediaWikiExternalLink("click here", imageLink),
      new MediaWikiText("."),
    ]*/
    const hasCaption = !!captionText;

    // Use link from context only for Button.png images (link from a preceding <a> tag),
    // otherwise a caption link, otherwise a data-link-href attribute, otherwise undefined
    const fileLink =
      imageLink.includes("Button.png") && link
        ? (link as string)
        : captionLink
        ? captionLink
        : image.attributes["data-link-href"]
        ? image.attributes["data-link-href"]
        : undefined;

    const caption = captionText
      ? new MediaWikiText(captionText, { italics: true })
      : undefined;

    return [
      new MediaWikiFile(fileNameToUse, {
        resizing: {
          width:
            (width as number) ??
            (dimensions?.width > 600 || !dimensions ? 600 : dimensions.width),
        },
        format: hasCaption ? "thumb" : undefined,
        horizontalAlignment: hasCaption || center ? "center" : undefined,
        link: fileLink,
        caption: caption,
      }),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
    ];
  }
  return new MediaWikiComment("Invalid image node");
};

export default imageParser;
