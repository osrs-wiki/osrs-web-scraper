import boldParser from "./bold";
import breakParser from "./break";
import centerParser from "./center";
import fontParser from "./font";
import iframeParser from "./iframe";
import imageParser from "./image";
import italicsParser from "./italics";
import linkParser from "./link";
import listParser from "./list";
import listItemParser from "./listItem";
import paragraphParser from "./paragraph";
import underlineParser from "./underline";
import { MediaWikiComment } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const nodeParserMap: { [key: string]: ContentNodeParser } = {
  a: linkParser,
  b: boldParser,
  i: italicsParser,
  br: breakParser,
  center: centerParser,
  img: imageParser,
  iframe: iframeParser,
  font: fontParser,
  li: listItemParser,
  ol: listParser,
  p: paragraphParser,
  u: underlineParser,
  ul: listParser,
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
