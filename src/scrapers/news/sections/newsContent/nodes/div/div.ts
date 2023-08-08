import { HTMLElement } from "node-html-parser";

import pollBoxParser from "./pollBox";
import rowParser from "./row";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

const ignoredClasses = ["myslides"];

const classParserMap: { [key: string]: ContentNodeParser } = {
  "poll-box": pollBoxParser,
  "row": rowParser,
};

export const divParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const className = element.classNames.trim().toLowerCase();
    const parse = classParserMap[className];
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
