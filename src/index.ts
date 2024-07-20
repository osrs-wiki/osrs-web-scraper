import config from "@config";
import { Command } from "commander";

import scraper from "./scraper";
import { news, polls, worlds } from "./scrapers";
import { WORLD_LIST_URL } from "./scrapers/worlds/worlds.utils";
import packageJson from "../package.json";

console.log(`Running ${config.environment}`);

const program = new Command();

program.name("OSRS Web Scraper").description("").version(packageJson.version);

program
  .command("news")
  .description("Scrape an OSRS news posts.")
  .argument("<string>", "The news post to scrape.")
  .action((newsLink) => {
    scraper.scrape(newsLink, news);
  });

program
  .command("poll")
  .description("Scrape an OSRS poll.")
  .argument("<string>", "The poll to scrape.")
  .action((pollLink) => {
    scraper.scrape(pollLink, polls);
  });

program
  .command("worlds")
  .description("Scrape the OSRS world list.")
  .action(() => {
    scraper.scrape(WORLD_LIST_URL, worlds);
  });

program.parse();
