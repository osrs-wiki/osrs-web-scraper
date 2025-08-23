import { MediaWikiHTML, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import { HTMLElement } from "node-html-parser";

import { extractBackgroundImageUrl } from "../../../../../../utils/css";
import { formatFileName, getFileExtension } from "../../../../../../utils/file";
import { ContentContext } from "../../newsContent";
import { ContentNodeParser } from "../../types";

// Handler for slideshow container galleries with background images
const handleSlideshowGallery = (divElement: HTMLElement, options: { [key: string]: string | boolean | number }): MediaWikiText[] => {
  const content: MediaWikiText[] = [];
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

  return content;
};

// Handler for regular galleries with img tags
const handleRegularGallery = (divElement: HTMLElement, options: { [key: string]: string | boolean | number }): MediaWikiText[] => {
  const content: MediaWikiText[] = [];
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

  return content;
};

// Map of gallery types to their handlers
const galleryHandlers: { [key: string]: (element: HTMLElement, options: { [key: string]: string | boolean | number }) => MediaWikiText[] } = {
  "slideshow-container": handleSlideshowGallery,
  "default": handleRegularGallery,
};

export const galleryParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement && node.childNodes.length > 0) {
    const divElement = node as HTMLElement;
    
    // Determine gallery type and use appropriate handler
    let galleryType = "default";
    if (divElement.id === "slideshow-container" || divElement.classList.contains("slideshow-container")) {
      galleryType = "slideshow-container";
    }
    
    const handler = galleryHandlers[galleryType];
    const content = handler(divElement, options);

    return new MediaWikiHTML("gallery", content, {
      mode: "packed",
      heights: "180",
      style: "text-align:center",
    });
  }
};

export default galleryParser;
