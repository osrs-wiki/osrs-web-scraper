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

import { getLatestRSSCateogry, getNewsCategory } from "./newsHeader.utils";
import {
  downloadFile,
  formatFileName,
  getFileExtension,
  findFileByBaseName,
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

    const newspostImageBaseName = `${formattedTitle} newspost`;
    const newspostImageExtension = getFileExtension(image.attributes.src);
    const newspostImageName = `${newspostImageBaseName}.${newspostImageExtension}`;
    
    downloadFile(image.attributes.src, `${newsDirectory}/${newspostImageName}`);

    // Check if the file exists with a different extension (due to MIME type correction)
    const actualFileName = findFileByBaseName(newsDirectory, newspostImageBaseName);
    const fileNameToUse = actualFileName || newspostImageName;

    const content: MediaWikiContent[] = [];

    content.push(
      new UpdateTemplate({
        url,
        date: date.innerText,
        category,
      }).build()
    );
    content.push(
      new MediaWikiFile(fileNameToUse, {
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
