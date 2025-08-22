import { MediaWikiContent } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import { parse } from "node-html-parser";

import { nodeParser } from "./nodes";
import { extractBackgroundImageUrl } from "../../../../utils/css";
import {
  downloadFile,
  formatFileName,
  getFileExtension,
} from "../../../../utils/file";
import { getNodeTagName } from "../../../../utils/nodes";
import { NewsSection } from "../types";

export type ContentSection = NewsSection & {
  title: string;
};

const ignoredTags = ["style", "script"];
const ignoredImageClasses: string[] = ["demo cursor", "demo cursor active"];

export const ContentContext = {
  imageCount: 0,
};

const newsContent: NewsSection = {
  format: async (html, url, title) => {
    const contentRoot = parse(html);

    // Download regular images from img and video source tags
    const images = contentRoot.querySelectorAll("img, video > source");
    let downloadedImages = 0;
    const downloadQueue = [];
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const imageLink = image.attributes.src ?? image.attributes.href;

      if (
        imageLink.endsWith("hr.png") ||
        ignoredImageClasses.includes(image.classNames.trim().toLowerCase())
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
        downloadFile(
          imageLink,
          `${imageDirectory}/${imageName}.${getFileExtension(imageLink)}`
        )
      );
    }

    // Also download background images from figure elements and div.divisor elements
    const figureElements = contentRoot.querySelectorAll("figure, div.divisor");
    for (let index = 0; index < figureElements.length; index++) {
      const element = figureElements[index];
      const style = element.attributes?.style;
      
      if (style) {
        const backgroundImageUrl = extractBackgroundImageUrl(style);
        if (backgroundImageUrl) {
          const formattedTitle = formatFileName(title);
          const imageDirectory = `./out/news/${formattedTitle}`;
          if (!fs.existsSync(imageDirectory)) {
            fs.mkdirSync(imageDirectory, { recursive: true });
          }

          const imageName = `${formattedTitle} (${++downloadedImages})`;
          downloadQueue.push(
            downloadFile(
              backgroundImageUrl,
              `${imageDirectory}/${imageName}.${getFileExtension(backgroundImageUrl)}`
            )
          );
        }
      }
    }

    try {
      await Promise.all(downloadQueue);
    } catch (error) {
      console.error(error);
    }

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
