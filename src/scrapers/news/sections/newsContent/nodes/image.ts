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
      if (image.attributes.width) {
        dimensions = { width: parseInt(image.attributes.width) };
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

    const captionLink = image.attributes["data-caption-link"];
    const captionText = image.attributes["data-caption-text"]; /* ?? [
      new MediaWikiText("If you can't see the asset above, "),
      new MediaWikiExternalLink("click here", imageLink),
      new MediaWikiText("."),
    ]*/
    const hasCaption = !!captionText;

    // Use link from context if available (from preceding <a> tag), otherwise Button.png check, otherwise undefined
    const fileLink =
      imageLink.includes("Button.png") && link
        ? (link as string)
        : captionLink
        ? captionLink
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
