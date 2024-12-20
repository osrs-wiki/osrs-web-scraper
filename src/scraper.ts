import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import puppeteer, { Browser, Page } from "puppeteer";

import { ScrapingService } from "./scrapers";

const JQUERY_URL = "https://code.jquery.com/jquery-3.2.1.min.js";

class Scraper {
  browser: Browser;

  page: Page;

  scrape = async (url: string, scraper: ScrapingService<MediaWikiBuilder>) => {
    this.browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disabled-setupid-sandbox"],
    });
    this.page = await this.browser.newPage();

    await this.page.goto(url, { waitUntil: "networkidle2" });
    await this.page.addScriptTag({
      url: JQUERY_URL,
    });

    try {
      await scraper.scrape(this.page);
    } catch (error) {
      console.error(error);
    } finally {
      this.browser.close();
    }
  };
}

const scraper = new Scraper();

export default scraper;
