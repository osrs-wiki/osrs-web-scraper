import fs from "fs";
import sizeOf from "image-size";
import { HTMLElement } from "node-html-parser";

import {
  MediaWikiComment,
  MediaWikiFile,
} from "../../../../../utils/mediawiki";
import { ContentContext } from "../newsContent";
import { ContentNodeParser } from "../types";
import { getImageExtension } from "../../../../../utils/images";

export const imageParser: ContentNodeParser = (node, { title, center }) => {
  if (node instanceof HTMLElement) {
    const image = node as HTMLElement;
    const imageLink = image.attributes.src;

    if (imageLink.endsWith("hr.png")) {
      return undefined;
    }

    const imageDirectory = `./out/news/${title}`;
    if (!fs.existsSync(imageDirectory)) {
      fs.mkdirSync(imageDirectory, { recursive: true });
    }

    const imageName = `${title} (${++ContentContext.imageCount})`;
    const imageExtension = getImageExtension(imageLink);
    const dimensions = sizeOf(`${imageDirectory}/${imageName}.png`);

    return new MediaWikiFile(`${imageName}.${imageExtension}`, {
      resizing: { width: dimensions.width > 600 ? 600 : dimensions.width },
      horizontalAlignment: center ? "center" : undefined,
    });
  }
  return new MediaWikiComment("Invalid image node");
};

export default imageParser;
