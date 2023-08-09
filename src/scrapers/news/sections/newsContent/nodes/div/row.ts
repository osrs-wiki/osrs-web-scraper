import fs from "fs";
import { HTMLElement } from "node-html-parser";

import {
  formatFileName,
  getImageExtension,
} from "../../../../../../utils/images";
import {
  MediaWikiHTML,
  MediaWikiText,
} from "../../../../../../utils/mediawiki";
import { ContentContext } from "../../newsContent";
import { ContentNodeParser } from "../../types";

export const rowParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement && node.childNodes.length > 0) {
    const divElement = node as HTMLElement;
    const imageNodes = divElement.childNodes.filter(
      (childNode) =>
        childNode instanceof HTMLElement &&
        (childNode as HTMLElement).rawTagName === "img"
    );
    const content = imageNodes.map((imageNode) => {
      const image = imageNode as HTMLElement;
      const imageLink = image.attributes.src;

      const formattedTitle = formatFileName(options.title as string);
      const imageDirectory = `./out/news/${formattedTitle}`;
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }

      const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
      const imageExtension = getImageExtension(imageLink);

      return new MediaWikiText(`\n${imageName}.${imageExtension}`);
    });
    return new MediaWikiHTML("gallery", content, {
      mode: "packed",
      heights: "180",
      style: "text-align:center",
    });
  }
};

export default rowParser;
