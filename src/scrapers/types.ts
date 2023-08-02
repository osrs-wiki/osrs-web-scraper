import { Page } from "puppeteer";

export interface ScrapingService<T = void> {
  scrape: (page: Page) => Promise<T>;
}
