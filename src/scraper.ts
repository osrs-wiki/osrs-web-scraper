import puppeteer, { Browser, Page } from "puppeteer";

import { ScrapingService } from "./scrapers";

const JQUERY_URL = "https://code.jquery.com/jquery-3.2.1.min.js";

class Scraper {
  browser: Browser;

  page: Page;

  scrape = async (url: string, scraper: ScrapingService<any>) => {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();

    await this.page.goto(url, { waitUntil: "networkidle2" });
    await this.page.addScriptTag({
      url: JQUERY_URL,
    });

    await scraper.scrape(this.page);
  };
}

const scraper = new Scraper();

export default scraper;
