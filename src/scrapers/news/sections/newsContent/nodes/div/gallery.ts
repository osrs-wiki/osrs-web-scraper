import { MediaWikiHTML, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import { HTMLElement } from "node-html-parser";

import { extractBackgroundImageUrl } from "../../../../../../utils/css";
import {
  findFileByBaseName,
  formatFileName,
  getFileExtension,
} from "../../../../../../utils/file";
import { ContentContext } from "../../newsContent";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

// Helper function to convert a caption element's child nodes (text, links, italics, etc.)
// into a single line of wikitext suitable for a gallery caption
const buildCaptionText = (
  captionElement: HTMLElement | null,
  options: { [key: string]: string | boolean | number }
): string | undefined => {
  if (!captionElement) {
    return undefined;
  }

  const childContent = captionElement.childNodes
    .map((childNode) =>
      childNode instanceof HTMLElement
        ? nodeParser(childNode, options)
        : textParser(childNode, options)
    )
    .flat()
    .filter((content) => content != null);

  if (childContent.length === 0) {
    return undefined;
  }

  const caption = new MediaWikiText(childContent).build().trim();
  return caption === "" ? undefined : caption;
};

// Helper function to process background image elements and add them to content
const processBackgroundImageElement = (
  element: HTMLElement | null,
  formattedTitle: string,
  content: MediaWikiText[]
): void => {
  if (element && element.attributes?.style) {
    const imageUrl = extractBackgroundImageUrl(element.attributes.style);
    if (imageUrl) {
      const imageDirectory = `./out/news/${formattedTitle}`;
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }

      const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
      const imageExtension = getFileExtension(imageUrl);

      // Check if the file exists with a different extension (due to MIME type correction)
      const actualFileName = findFileByBaseName(imageDirectory, imageName);
      const fileNameToUse = actualFileName || `${imageName}.${imageExtension}`;

      content.push(
        new MediaWikiText(`${content.length === 0 ? "" : "\n"}${fileNameToUse}`)
      );
    }
  }
};

// Handler for slideshow container galleries with background images
const handleSlideshowGallery = (
  divElement: HTMLElement,
  options: { [key: string]: string | boolean | number }
): MediaWikiText[] => {
  const content: MediaWikiText[] = [];
  const slides = divElement.querySelectorAll(".mySlides");
  const formattedTitle = formatFileName(options.title as string);

  slides.forEach((slide) => {
    const figureElement = slide.querySelector("figure");
    const divisorElement = slide.querySelector("div.divisor");

    // Extract background image from figure element (SD version)
    processBackgroundImageElement(figureElement, formattedTitle, content);

    // Extract background image from divisor element (HD version)
    processBackgroundImageElement(divisorElement, formattedTitle, content);
  });

  return content;
};

// Handler for regular galleries with img tags
const handleRegularGallery = (
  divElement: HTMLElement,
  options: { [key: string]: string | boolean | number }
): MediaWikiText[] => {
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

    // Check if the file exists with a different extension (due to MIME type correction)
    const actualFileName = findFileByBaseName(imageDirectory, imageName);
    const fileNameToUse = actualFileName || `${imageName}.${imageExtension}`;

    content.push(
      new MediaWikiText(`${index === 0 ? "" : "\n"}${fileNameToUse}`)
    );
  });

  return content;
};

// Handler for osrs-carousel galleries, which include a caption per slide
// (either an `.osrs-carousel__caption` element or a `data-caption-full` attribute on the image)
const handleCarouselGallery = (
  divElement: HTMLElement,
  options: { [key: string]: string | boolean | number }
): MediaWikiText[] => {
  const content: MediaWikiText[] = [];
  const formattedTitle = formatFileName(options.title as string);
  const imageDirectory = `./out/news/${formattedTitle}`;
  const slides = divElement.querySelectorAll(".osrs-carousel__slide");

  if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory, { recursive: true });
  }

  slides.forEach((slide) => {
    const imageNode = slide.querySelector("img");
    // Video slides (osrs-carousel__video) have no <img> tag and aren't downloaded, so skip them
    if (!imageNode) {
      return;
    }

    const imageLink = imageNode.attributes.src;
    const imageName = `${formattedTitle} (${++ContentContext.imageCount})`;
    const imageExtension = getFileExtension(imageLink);

    // Check if the file exists with a different extension (due to MIME type correction)
    const actualFileName = findFileByBaseName(imageDirectory, imageName);
    const fileNameToUse = actualFileName || `${imageName}.${imageExtension}`;

    const captionElement = slide.querySelector(".osrs-carousel__caption");
    const caption =
      buildCaptionText(captionElement, options) ??
      imageNode.attributes["data-caption-full"];

    content.push(
      new MediaWikiText(
        `${content.length === 0 ? "" : "\n"}${fileNameToUse}${
          caption ? `|${caption}` : ""
        }`
      )
    );
  });

  return content;
};

// Map of gallery types to their handlers
const galleryHandlers: {
  [key: string]: (
    element: HTMLElement,
    options: { [key: string]: string | boolean | number }
  ) => MediaWikiText[];
} = {
  "slideshow-container": handleSlideshowGallery,
  "osrs-carousel": handleCarouselGallery,
  "default": handleRegularGallery,
};

export const galleryParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement && node.childNodes.length > 0) {
    const divElement = node as HTMLElement;

    // Determine gallery type and use appropriate handler
    let galleryType = "default";
    if (
      divElement.id === "slideshow-container" ||
      divElement.classList.contains("slideshow-container")
    ) {
      galleryType = "slideshow-container";
    } else if (divElement.classList.contains("osrs-carousel")) {
      galleryType = "osrs-carousel";
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
