import config from "@config";

import scraper from "./scraper";
import news from "./scrapers/news";

console.log(`Running ${config.environment}`);

const newsLink = process.env.NEWS_LINK;

if (newsLink) {
  scraper.scrape(newsLink, news);
} else {
  console.error("No news link provided.");
}
