import fs from "fs";
import { HTMLElement } from "node-html-parser";

import {
  downloadImage,
  formatFileName,
  getImageExtension,
} from "../../../../../utils/images";
import {
  ListenTemplate,
  MediaWikiComment,
} from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const audioParser: ContentNodeParser = (node, { title }) => {
  if (node instanceof HTMLElement && node.firstChild instanceof HTMLElement) {
    const source = node.firstChild as HTMLElement;
    const audioLink = source.attributes.src;

    const formattedTitle = formatFileName(title as string);
    const audioDirectory = `./out/news/${formattedTitle}`;
    if (!fs.existsSync(audioDirectory)) {
      fs.mkdirSync(audioDirectory, { recursive: true });
    }

    const audioExtension = getImageExtension(audioLink);
    const outputFileName = `${formattedTitle} narration.${audioExtension}`;

    downloadImage(audioLink, `${audioDirectory}/${outputFileName}`);

    return new ListenTemplate(outputFileName, {
      align: "center",
      title: "Audio reading",
    }).build();
  }
  return new MediaWikiComment("Invalid audio node");
};

export default audioParser;
