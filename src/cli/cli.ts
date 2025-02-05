import { Command } from "commander";

import { news, poll, worlds } from "./commands";
import packageJson from "../../package.json";

const cli = new Command();

cli.name("OSRS Web Scraper").description("").version(packageJson.version);

cli.addCommand(news);
cli.addCommand(poll);
cli.addCommand(worlds);

export default cli;
