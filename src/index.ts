import config from "@config";

import scraper from "./scraper";
import news from "./scrapers/news";

console.log(`Running ${config.environment}`);

scraper.scrape(
  //"https://secure.runescape.com/m=news/old-school-roadmap?oldschool=1",
  "https://secure.runescape.com/m=news/forestry-part-two---community-consultation?oldschool=1",
  news
);
