import {
  MediaWikiExternalLink,
  MediaWikiHTML,
  MediaWikiTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";
import { URL } from "node:url";

import { ContentNodeParser } from "../types";

export const iframeParser: ContentNodeParser = (node) => {
  const htmlNode = node as HTMLElement;
  const link =
    htmlNode.attributes["data-cookieblock-src"] ?? htmlNode.attributes["src"];
  const parsedUrl = new URL(link);
  if (parsedUrl.hostname.includes("youtube.com")) {
    if (parsedUrl.pathname.includes("videoseries")) {
      const playlistId = parsedUrl.searchParams.get("list");
      if (playlistId) {
        const youtubeTemplate = new MediaWikiTemplate("Youtube", {
          collapsed: true,
        });
        youtubeTemplate.add("type", "playlist");
        youtubeTemplate.add("", playlistId);
        return youtubeTemplate;
      }
    } else {
      const videoId = parsedUrl.pathname.match(/\/embed\/([^\/?]+)/)?.[1];
      if (videoId) {
        const youtubeTemplate = new MediaWikiTemplate("Youtube", {
          collapsed: true,
        });
        youtubeTemplate.add("", videoId);

        return youtubeTemplate;
      }
    }
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
