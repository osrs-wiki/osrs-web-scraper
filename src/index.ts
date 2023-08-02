import config from "@config";

import scraper from "./scraper";
import news from "./scrapers/news";

console.log(`Running ${config.environment}`);

const newsLink = process.env.NEWS_LINK;

if (newsLink) {
  scraper.scrape(
    //"https://secure.runescape.com/m=news/old-school-roadmap?oldschool=1",
    //"https://secure.runescape.com/m=news/forestry-part-two---community-consultation?oldschool=1",
    //"https://secure.runescape.com/m=news/a=1/desert-treasure-ii---the-fallen-empire?oldschool=1",
    newsLink,
    news
  );
} else {
  console.error("No news link provided.");
}
