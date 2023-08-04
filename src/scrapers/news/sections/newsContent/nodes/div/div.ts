import { HTMLElement } from "node-html-parser";

import pollBoxParser from "./pollBox";
import { MediaWikiComment } from "../../../../../../utils/mediawiki";
import { getNodeTagName } from "../../../../../../utils/nodes";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

const classParserMap: { [key: string]: ContentNodeParser } = {
  "poll-box": pollBoxParser,
};

export const divParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const className = element.classNames.trim().toLowerCase();
    const parse = classParserMap[className];
    if (parse) {
      return parse(node, options);
    } else {
      const childrenContent = node.childNodes
        .map((child) => nodeParser(child, options))
        .flat();
      childrenContent.unshift(
        new MediaWikiComment(`Unsupported class: ${className}`)
      );
      return childrenContent;
    }
  } else {
    return textParser(node, options);
  }
};

export default divParser;
