import breakParser from "./break";
import centerParser from "./center";
import imageParser from "./image";
import linkParser from "./link";
import textParser from "./text";
import { MediaWikiComment } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const nodeParserMap: { [key: string]: ContentNodeParser } = {
  a: linkParser,
  b: textParser,
  i: textParser,
  br: breakParser,
  center: centerParser,
  img: imageParser,
  p: textParser,
  u: textParser,
};

const nodeParser: ContentNodeParser = (node, options) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const tagName: string = node.rawTagName;
  const parse = nodeParserMap[tagName];
  if (parse) {
    return parse(node, options);
  } else {
    return new MediaWikiComment(`Unsupported tag: ${tagName}`);
  }
};

export default nodeParser;
