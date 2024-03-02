import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiFile,
  MediaWikiTOC,
  MediaWikiTemplate,
  UpdateTemplate,
} from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import { parse } from "node-html-parser";
import Parser from "rss-parser";

import {
  NEWS_RSS_LINK,
  getLatestRSSCateogry,
  getNewsCategory,
  getNewsUrlIdentifier,
} from "./newsHeader.utils";
import {
  downloadFile,
  formatFileName,
  getFileExtension,
} from "../../../../utils/file";
import { NewsSection } from "../types";

const newsHeader: NewsSection = {
  format: async (html, url, title) => {
    const rssCategory = await getLatestRSSCateogry(url);
    const category = getNewsCategory(rssCategory ?? "");

    const headerRoot = parse(html);

    const date = headerRoot.querySelector(".news-article-header__date");
    const image = headerRoot.querySelector("#osrsSummaryImage img");

    const formattedTitle = formatFileName(title);
    const newsDirectory = `./out/news/${formattedTitle}`;
    if (!fs.existsSync(newsDirectory)) {
      fs.mkdirSync(newsDirectory, { recursive: true });
    }

    const newspostImageName = `${formattedTitle} newspost.${getFileExtension(
      image.attributes.src
    )}`;
    downloadFile(image.attributes.src, `${newsDirectory}/${newspostImageName}`);

    const content: MediaWikiContent[] = [];

    content.push(
      new UpdateTemplate({
        url,
        date: date.innerText,
        category,
      }).build()
    );
    content.push(
      new MediaWikiFile(newspostImageName, {
        horizontalAlignment: "right",
      })
    );
    content.push(new MediaWikiBreak());
    content.push(new MediaWikiTemplate("clear"));
    content.push(new MediaWikiTOC());

    return content;
  },
};

export default newsHeader;
