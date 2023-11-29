import fs from "fs";
import sizeOf from "image-size";
import { HTMLElement } from "node-html-parser";

import { formatFileName, getFileExtension } from "../../../../../utils/file";
import {
  MediaWikiBreak,
  MediaWikiComment,
  MediaWikiFile,
} from "../../../../../utils/mediawiki";
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
    const imagePath = `${imageDirectory}/${imageName}.${imageExtension}`;
    let dimensions;
    if (imageExtensions.includes(imageExtension) && fs.existsSync(imagePath)) {
      dimensions = sizeOf(`${imageDirectory}/${imageName}.${imageExtension}`);
    }

    return [
      new MediaWikiFile(`${imageName}.${imageExtension}`, {
        resizing: {
          width:
            (width as number) ??
            (dimensions?.width > 600 || !dimensions ? 600 : dimensions.width),
        },
        horizontalAlignment: center ? "center" : undefined,
        link:
          imageLink.includes("Button.png") && link
            ? (link as string)
            : undefined,
      }),
      new MediaWikiBreak(),
    ];
  }
  return new MediaWikiComment("Invalid image node");
};

export default imageParser;
