import { MediaWikiComment } from "@osrs-wiki/mediawiki-builder";

import audioParser from "./audio";
import boldParser from "./bold";
import breakParser from "./break";
import centerParser from "./center";
import detailsParser from "./details";
import divParser from "./div";
import fontParser from "./font";
import htmlParser from "./html";
import iframeParser from "./iframe";
import imageParser from "./image";
import italicsParser from "./italics";
import linkParser from "./link";
import listParser from "./list";
import listItemParser from "./listItem";
import paragraphParser from "./paragraph";
import spanParser from "./span";
import tableParser from "./table";
import titleParser from "./title";
import underlineParser from "./underline";
import videoParser from "./video";
import { ContentNodeParser } from "../types";

const ignoredTags = ["script"];

const nodeParserMap: { [key: string]: ContentNodeParser } = {
  a: linkParser,
  audio: audioParser,
  b: boldParser,
  bigtitle: titleParser,
  details: detailsParser,
  div: divParser,
  i: italicsParser,
  br: breakParser,
  center: centerParser,
  img: imageParser,
  iframe: iframeParser,
  font: fontParser,
  li: listItemParser,
  ol: listParser,
  p: paragraphParser,
  smalltitle: titleParser,
  sub: htmlParser,
  sup: htmlParser,
  span: spanParser,
  strong: boldParser,
  table: tableParser,
  u: underlineParser,
  ul: listParser,
  u1: listParser,
  video: videoParser,
};

const nodeParser: ContentNodeParser = (node, options) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const tagName: string = node.rawTagName;
  const parse = nodeParserMap[tagName];
  if (parse) {
    return parse(node, options);
  } else if (tagName && !ignoredTags.includes(tagName)) {
    return new MediaWikiComment(`Unsupported tag: ${tagName}`);
  }
};

export default nodeParser;
