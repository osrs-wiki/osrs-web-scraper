import { HTMLElement } from "node-html-parser";

import pollBoxParser from "./pollBox";
import { MediaWikiComment } from "../../../../../../utils/mediawiki";
import { getNodeTagName } from "../../../../../../utils/nodes";
import { ContentNodeParser } from "../../types";

const classParserMap: { [key: string]: ContentNodeParser } = {
  "poll-box": pollBoxParser,
};

export const divParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const element = node as HTMLElement;
    const className = element.classNames;
    const parse = classParserMap[className];
    if (parse) {
      return parse(node, options);
    } else {
      return new MediaWikiComment(`Unsupported tag: ${className}`);
    }
  } else {
    return new MediaWikiComment(`Unsupported tag: ${getNodeTagName(node)}`);
  }
};

export default divParser;
