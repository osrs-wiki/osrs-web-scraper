import { Command } from "commander";

import scraper from "../../../scraper";
import { worlds as worldsScraper } from "../../../scrapers";
import { WORLD_LIST_URL } from "../../../scrapers/worlds/worlds.utils";

const worlds = new Command("worlds")
  .description("Scrape the OSRS world list.")
  .action(() => {
    scraper.scrape(WORLD_LIST_URL, worldsScraper);
  });

export default worlds;
