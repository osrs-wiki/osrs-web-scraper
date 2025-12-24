import { HTMLElement } from "node-html-parser";

import galleryParser from "./gallery";
import imageCaptionParser from "./imageCaption";
import osrsHeaderParser from "./osrsHeader";
import pollBoxParser from "./pollBox";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

const ignoredClasses = ["myslides", "thumb-row"];

const classParserMap: { [key: string]: ContentNodeParser } = {
  "poll-box": pollBoxParser,
  "row": galleryParser,
  "osrs-title": osrsHeaderParser,
  "osrs-subtitle": osrsHeaderParser,
  "osrs-subheading": osrsHeaderParser,
  "image-caption": imageCaptionParser,
};

const idParserMap: { [key: string]: ContentNodeParser } = {
  "slideshow-container": galleryParser,
};

export const divParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const className = element.classNames.trim().toLowerCase();
    const id = element.id;
    const parse = classParserMap[className] ?? idParserMap[id];

    if (parse) {
      return parse(node, options);
    } else if (!ignoredClasses.includes(className)) {
      return node.childNodes.map((child) => nodeParser(child, options)).flat();
    }
  } else {
    return textParser(node, options);
  }
};

export default divParser;
