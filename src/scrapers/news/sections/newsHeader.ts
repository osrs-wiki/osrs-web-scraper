import fs from "fs";
import { parse } from "node-html-parser";

import { NewsSection } from "./types";
import { downloadImage, formatFileName } from "../../../utils/images";
import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiFile,
  MediaWikiTOC,
  MediaWikiTemplate,
  UpdateTemplate,
} from "../../../utils/mediawiki";

const newsHeader: NewsSection = {
  format: async (html, url, title) => {
    const headerRoot = parse(html);

    const date = headerRoot.querySelector(".news-article-header__date");
    const image = headerRoot.querySelector("#osrsSummaryImage img");

    const formattedTitle = formatFileName(title);
    const newsDirectory = `./out/news/${formattedTitle}`;
    if (!fs.existsSync(newsDirectory)) {
      fs.mkdirSync(newsDirectory, { recursive: true });
    }

    const newspostImageName = `${formattedTitle} newspost`;
    downloadImage(
      image.attributes.src,
      `${newsDirectory}/${newspostImageName}.png`
    );

    const content: MediaWikiContent[] = [];

    content.push(
      new UpdateTemplate({
        url,
        date: date.innerText,
        category: "game",
      }).build()
    );
    content.push(new MediaWikiBreak());
    content.push(
      new MediaWikiFile(`${newspostImageName}.png`, {
        horizontalAlignment: "right",
      })
    );
    content.push(new MediaWikiBreak());
    content.push(new MediaWikiTemplate("clear"));
    content.push(new MediaWikiBreak());
    content.push(new MediaWikiTOC());

    return content;
  },
};

export default newsHeader;