import { parse } from "node-html-parser";

import { PollSection } from "./types";
import { MediaWikiBreak, MediaWikiContent } from "../../../utils/mediawiki";

const pollHeader: PollSection = {
  format: async (html, url) => {
    const headerContent = parse(html);

    const title = headerContent.querySelector("h2").textContent;
    const description = headerContent.querySelector(":not(h2):not(div)");
    const total = headerContent.querySelector("div");

    const content: MediaWikiContent[] = [];

    const number = url.split("=")?.[2];
    const startDate = title.match(/\(([^)]+)\)/g)?.[1];

    content.push(new MediaWikiBreak());

    return content;
  },
};

export default pollHeader;
