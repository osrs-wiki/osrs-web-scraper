import { Command } from "commander";

import scraper from "../../../scraper";
import { polls } from "../../../scrapers";

const poll = new Command("poll")
  .description("Scrape an OSRS poll.")
  .argument("<string>", "The poll to scrape.")
  .action((pollLink) => {
    scraper.scrape(pollLink, polls);
  });

export default poll;
