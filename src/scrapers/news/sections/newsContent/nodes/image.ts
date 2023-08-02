import fs from "fs";
import sizeOf from "image-size";
import { HTMLElement } from "node-html-parser";

import { formatFileName, getImageExtension } from "../../../../../utils/images";
import {
  MediaWikiComment,
  MediaWikiFile,
} from "../../../../../utils/mediawiki";
import { ContentContext } from "../newsContent";
import { ContentNodeParser } from "../types";

export const imageParser: ContentNodeParser = (node, { title, center }) => {
  if (node instanceof HTMLElement) {
    const image = node as HTMLElement;
    const imageLink = image.attributes.src;

    if (imageLink.endsWith("hr.png")) {
      return undefined;
    }

    const formattedTitle = formatFileName(title as string);
    const imageDirectory = `./out/news/${formattedTitle}`;
    if (!fs.existsSync(imageDirectory)) {
      fs.mkdirSync(imageDirectory, { recursive: true });
    }

    const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
    const imageExtension = getImageExtension(imageLink);
    const dimensions = sizeOf(
      `${imageDirectory}/${imageName}.${imageExtension}`
    );

    return new MediaWikiFile(`${imageName}.${imageExtension}`, {
      resizing: { width: dimensions.width > 600 ? 600 : dimensions.width },
      horizontalAlignment: center ? "center" : undefined,
    });
  }
  return new MediaWikiComment("Invalid image node");
};

export default imageParser;
