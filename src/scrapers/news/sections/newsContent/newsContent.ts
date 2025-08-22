import { MediaWikiContent } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import { parse, HTMLElement } from "node-html-parser";

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

/**
 * Check if an element is within a thumbnails section
 */
function isWithinThumbnails(element: HTMLElement): boolean {
  let current = element.parentNode;
  while (current) {
    if (current.attributes?.id === "thumbnails") {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}

export const ContentContext = {
  imageCount: 0,
};

const newsContent: NewsSection = {
  format: async (html, url, title) => {
    const contentRoot = parse(html);

    // Download images in the order they appear on the page
    // This includes both regular img/video tags and elements with background images
    const imageElements = contentRoot.querySelectorAll("img, video > source, figure, div.divisor");
    let downloadedImages = 0;
    const downloadQueue = [];
    
    const formattedTitle = formatFileName(title);
    const imageDirectory = `./out/news/${formattedTitle}`;
    if (!fs.existsSync(imageDirectory)) {
      fs.mkdirSync(imageDirectory, { recursive: true });
    }
    
    for (let index = 0; index < imageElements.length; index++) {
      const element = imageElements[index];
      
      // Skip images within thumbnail sections to avoid duplicates
      if (isWithinThumbnails(element)) {
        continue;
      }
      
      let imageUrl: string | undefined;
      
      // Handle regular img and video source tags
      if (element.tagName === "IMG" || element.tagName === "SOURCE") {
        imageUrl = element.attributes.src ?? element.attributes.href;
        
        if (
          imageUrl?.endsWith("hr.png") ||
          ignoredImageClasses.includes(element.classNames.trim().toLowerCase())
        ) {
          continue;
        }
      }
      // Handle elements with background images (figure and div.divisor)
      else if (element.tagName === "FIGURE" || (element.tagName === "DIV" && element.classNames.includes("divisor"))) {
        const style = element.attributes?.style;
        if (style) {
          imageUrl = extractBackgroundImageUrl(style);
        }
      }
      
      if (imageUrl) {
        const imageName = `${formattedTitle} (${++downloadedImages})`;
        downloadQueue.push(
          downloadFile(
            imageUrl,
            `${imageDirectory}/${imageName}.${getFileExtension(imageUrl)}`
          )
        );
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
