import {
  MediaWikiExternalLink,
  MediaWikiHTML,
  MediaWikiTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { ContentNodeParser } from "../types";

export const iframeParser: ContentNodeParser = (node) => {
  const htmlNode = node as HTMLElement;
  const link = htmlNode.attributes["data-cookieblock-src"];
  const videoId = link.includes("youtube.com") && link?.split("embed/")?.pop();
  if (videoId) {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", videoId);

    return youtubeTemplate;
  }
  return new MediaWikiHTML(
    "center",
    [
      new MediaWikiHTML(
        "big",
        [new MediaWikiExternalLink("title", link)],
        {},
        { collapsed: true }
      ),
    ],
    {},
    { collapsed: true }
  );
};

export default iframeParser;
