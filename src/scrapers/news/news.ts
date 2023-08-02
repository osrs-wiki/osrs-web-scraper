import fs from "fs";

import { newsContent, newsHeader } from "./sections";
import { formatFileName } from "../../utils/images";
import { MediaWikiBuilder } from "../../utils/mediawiki";
import { ScrapingService } from "../types";

const news: ScrapingService<MediaWikiBuilder> = {
  scrape: async (page): Promise<MediaWikiBuilder> => {
    try {
      const results = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Ignore window typing
        const $ = window.$;
        const title = $(".news-article-header__title").html();
        const headerHtml = $(".news-article-header").html();
        const contentHtml = $(".news-article-content #article-top").html();
        return {
          title,
          header: headerHtml,
          content: contentHtml,
        };
      });

      const builder = new MediaWikiBuilder();
      builder.addContents(
        await newsHeader.format(results.header, page.url(), results.title)
      );
      builder.addContents(
        await newsContent.format(results.content, page.url(), results.title)
      );

      try {
        await fs.writeFileSync(
          `out/news/${formatFileName(results.title)}/newspost.txt`,
          builder.build()
        );
      } catch (err) {
        console.error(err);
      }

      return builder;
    } catch (error) {
      console.error(error);
    }
  },
};

export default news;
