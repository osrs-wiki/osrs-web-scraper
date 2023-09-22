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

export const imageParser: ContentNodeParser = (node, { title, center }) => {
  if (node instanceof HTMLElement) {
    const image = node as HTMLElement;
    const imageLink = image.attributes.src;

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
    const dimensions = sizeOf(
      `${imageDirectory}/${imageName}.${imageExtension}`
    );

    return [
      new MediaWikiFile(`${imageName}.${imageExtension}`, {
        resizing: { width: dimensions.width > 600 ? 600 : dimensions.width },
        horizontalAlignment: center ? "center" : undefined,
      }),
      new MediaWikiBreak(),
    ];
  }
  return new MediaWikiComment("Invalid image node");
};

export default imageParser;
