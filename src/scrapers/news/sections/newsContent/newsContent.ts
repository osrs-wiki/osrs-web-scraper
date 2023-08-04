import fs from "fs";
import { parse } from "node-html-parser";

import { nodeParser } from "./nodes";
import {
  downloadImage,
  formatFileName,
  getImageExtension,
} from "../../../../utils/images";
import { MediaWikiContent } from "../../../../utils/mediawiki";
import { getNodeTagName } from "../../../../utils/nodes";
import { NewsSection } from "../types";

export type ContentSection = NewsSection & {
  title: string;
};

const ignoredTags = ["style"];
const ignoredImageClasses = ["demo cursor"];

export const ContentContext = {
  imageCount: 0,
};

const newsContent: NewsSection = {
  format: async (html, url, title) => {
    const contentRoot = parse(html);

    const images = contentRoot.querySelectorAll("img");
    let downloadedImages = 0;
    const downloadQueue = [];
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const imageLink = image.attributes.src;

      if (
        imageLink.endsWith("hr.png") ||
        ignoredImageClasses.includes(image.classNames.trim())
      ) {
        continue;
      }

      const formattedTitle = formatFileName(title);
      const imageDirectory = `./out/news/${formattedTitle}`;
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }

      const imageName = `${formattedTitle} (${++downloadedImages})`;
      downloadQueue.push(
        downloadImage(
          imageLink,
          `${imageDirectory}/${imageName}.${getImageExtension(imageLink)}`
        )
      );
    }
    await Promise.all(downloadQueue);

    let content: MediaWikiContent[] = [];

    console.info("Parsing content nodes...");
    contentRoot.childNodes.forEach((node) => {
      const tag = getNodeTagName(node);
      if (ignoredTags.includes(tag) || tag === undefined) {
        return;
      }
      const result = nodeParser(node, { url, title });
      if (result === undefined) {
        return;
      }
      if (Array.isArray(result)) {
        content = content.concat(result);
      } else {
        content.push(result);
      }
    });

    return content;
  },
};

export default newsContent;
