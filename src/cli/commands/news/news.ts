import { Command } from "commander";

import { getLatestNewsTitle } from "./news.utils";
import scraper from "../../../scraper";
import { news as newsScraper } from "../../../scrapers";

const news = new Command("news")
  .description("Scrape an OSRS news posts.")
  .argument("[string]", "The news post to scrape.")
  .action(async (newsLinkArg) => {
    let newsLink = newsLinkArg;
    if (!newsLink) {
      newsLink = await getLatestNewsTitle();
    }
    if (newsLink) {
      scraper.scrape(newsLink, newsScraper);
    } else {
      console.warn("No news post found.");
    }
  });

export default news;
