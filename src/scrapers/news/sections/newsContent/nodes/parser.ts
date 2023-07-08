import breakParser from "./break";
import textParser from "./text";
import { MediaWikiComment } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const nodeParserMap: { [key: string]: ContentNodeParser } = {
  br: breakParser,
  p: textParser,
};

const nodeParser: ContentNodeParser = (node) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const tagName: string = node.rawTagName;
  const parse = nodeParserMap[tagName];
  if (parse) {
    return parse(node);
  } else {
    return new MediaWikiComment(`Unsupported tag: ${tagName}`);
  }
};

export default nodeParser;
