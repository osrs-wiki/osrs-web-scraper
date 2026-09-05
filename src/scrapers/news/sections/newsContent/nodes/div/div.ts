import { HTMLElement } from "node-html-parser";

import galleryParser from "./gallery";
import imageCaptionParser from "./imageCaption";
import issueListParser from "./issueList";
import osrsHeaderParser from "./osrsHeader";
import pollBoxParser from "./pollBox";
import tableContainerParser from "./tableContainer";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

const ignoredClasses = [
  "myslides",
  "thumb-row",
  "table-scroll-notice",
  "osrstabnavigation",
];

const classParserMap: { [key: string]: ContentNodeParser } = {
  "poll-box": pollBoxParser,
  "poll-box2": pollBoxParser,
  "row": galleryParser,
  "osrs-carousel": galleryParser,
  "osrs-title": osrsHeaderParser,
  "osrs-subtitle": osrsHeaderParser,
  "osrs-subheading": osrsHeaderParser,
  "image-caption": imageCaptionParser,
  "table-container": tableContainerParser,
  "issue-list": issueListParser,
};

const idParserMap: { [key: string]: ContentNodeParser } = {
  "slideshow-container": galleryParser,
};

export const divParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    // Match on individual class tokens so compound class names (e.g. a base class
    // plus a modifier like "image-caption image-caption--empty") still resolve.
    const classNames = element.classNames.trim().toLowerCase().split(/\s+/);
    const id = element.id;
    const matchedClass = classNames.find(
      (className) => classParserMap[className]
    );
    const parse = matchedClass ? classParserMap[matchedClass] : idParserMap[id];

    if (parse) {
      return parse(node, options);
    } else if (
      !classNames.some((className) => ignoredClasses.includes(className))
    ) {
      return node.childNodes
        .map((childNode) => {
          if (childNode instanceof HTMLElement) {
            return nodeParser(childNode, options);
          }
          return textParser(childNode, options);
        })
        .flat();
    }
  } else {
    return textParser(node, options);
  }
};

export default divParser;
