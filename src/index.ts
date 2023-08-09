import config from "@config";

import scraper from "./scraper";
import { news, polls } from "./scrapers";

console.log(`Running ${config.environment}`);

const newsLink = process.env.NEWS_LINK;
const pollLink = process.env.POLL_LINK;

if (newsLink) {
  scraper.scrape(newsLink, news);
}

if (pollLink) {
  scraper.scrape(pollLink, polls);
}
