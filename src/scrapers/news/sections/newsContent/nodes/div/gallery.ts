import { MediaWikiHTML, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import { HTMLElement } from "node-html-parser";

import { extractBackgroundImageUrl } from "../../../../../../utils/css";
import { formatFileName, getFileExtension } from "../../../../../../utils/file";
import { ContentContext } from "../../newsContent";
import { ContentNodeParser } from "../../types";

export const galleryParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement && node.childNodes.length > 0) {
    const divElement = node as HTMLElement;
    const content: MediaWikiText[] = [];

    // Handle slideshow container (image slider)
    if (divElement.id === "slideshow-container" || divElement.classList.contains("slideshow-container")) {
      // Find all comparison slides
      const slides = divElement.querySelectorAll(".mySlides");
      
      slides.forEach((slide) => {
        const figureElement = slide.querySelector("figure");
        const divisorElement = slide.querySelector("div.divisor");
        
        // Extract background image from figure element (SD version)
        if (figureElement && figureElement.attributes?.style) {
          const figureUrl = extractBackgroundImageUrl(figureElement.attributes.style);
          if (figureUrl) {
            const formattedTitle = formatFileName(options.title as string);
            const imageDirectory = `./out/news/${formattedTitle}`;
            if (!fs.existsSync(imageDirectory)) {
              fs.mkdirSync(imageDirectory, { recursive: true });
            }

            const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
            const imageExtension = getFileExtension(figureUrl);
            
            content.push(new MediaWikiText(
              `${content.length === 0 ? "" : "\n"}${imageName}.${imageExtension}`
            ));
          }
        }

        // Extract background image from divisor element (HD version)
        if (divisorElement && divisorElement.attributes?.style) {
          const divisorUrl = extractBackgroundImageUrl(divisorElement.attributes.style);
          if (divisorUrl) {
            const formattedTitle = formatFileName(options.title as string);
            const imageDirectory = `./out/news/${formattedTitle}`;
            if (!fs.existsSync(imageDirectory)) {
              fs.mkdirSync(imageDirectory, { recursive: true });
            }

            const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
            const imageExtension = getFileExtension(divisorUrl);
            
            content.push(new MediaWikiText(
              `${content.length === 0 ? "" : "\n"}${imageName}.${imageExtension}`
            ));
          }
        }
      });
    } else {
      // Handle regular gallery with img tags (existing functionality)
      const imageNodes = divElement.querySelectorAll("img");
      imageNodes.forEach((imageNode, index) => {
        const image = imageNode as HTMLElement;
        const imageLink = image.attributes.src;

        const formattedTitle = formatFileName(options.title as string);
        const imageDirectory = `./out/news/${formattedTitle}`;
        if (!fs.existsSync(imageDirectory)) {
          fs.mkdirSync(imageDirectory, { recursive: true });
        }

        const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
        const imageExtension = getFileExtension(imageLink);

        content.push(new MediaWikiText(
          `${index === 0 ? "" : "\n"}${imageName}.${imageExtension}`
        ));
      });
    }

    return new MediaWikiHTML("gallery", content, {
      mode: "packed",
      heights: "180",
      style: "text-align:center",
    });
  }
};

export default galleryParser;
