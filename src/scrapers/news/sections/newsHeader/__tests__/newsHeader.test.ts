import { MediaWikiFile } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";

jest.mock("../newsHeader.utils", () => ({
  getLatestRSSCateogry: jest.fn().mockResolvedValue(undefined),
  getNewsCategory: jest.fn().mockReturnValue("game"),
}));

jest.mock("../../../../../utils/file", () => ({
  ...jest.requireActual("../../../../../utils/file"),
  downloadFile: jest.fn().mockResolvedValue("/out/news/Test Article/Test Article newspost.png"),
}));

import * as fileUtils from "../../../../../utils/file";
import newsHeader from "../newsHeader";

describe("newsHeader", () => {
  const url = "https://secure.runescape.com/m=news/test-article?oldschool=1";
  const title = "Test Article";

  beforeEach(() => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => "");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should include image when img has src attribute", async () => {
    const html = `
      <div class="news-article-header__date">06 March 2026</div>
      <div id="osrsSummaryImage">
        <img src="https://cdn.runescape.com/image.png" alt="Test" />
      </div>
    `;

    const result = await newsHeader.format(html, url, title);
    const fileItem = result.find((item) => item instanceof MediaWikiFile);
    expect(fileItem).toBeInstanceOf(MediaWikiFile);
  });

  test("should include image when img has data-src but no src", async () => {
    const html = `
      <div class="news-article-header__date">06 March 2026</div>
      <div id="osrsSummaryImage">
        <img data-src="https://cdn.runescape.com/image.png" alt="Test" />
      </div>
    `;

    const result = await newsHeader.format(html, url, title);
    const fileItem = result.find((item) => item instanceof MediaWikiFile);
    expect(fileItem).toBeInstanceOf(MediaWikiFile);
  });

  test("should use the filename returned by downloadFile (extension may be corrected)", async () => {
    jest.mocked(fileUtils.downloadFile).mockResolvedValueOnce(
      "/out/news/Test Article/Test Article newspost.jpg"
    );

    const html = `
      <div class="news-article-header__date">06 March 2026</div>
      <div id="osrsSummaryImage">
        <img src="https://cdn.runescape.com/image.png" alt="Test" />
      </div>
    `;

    const result = await newsHeader.format(html, url, title);
    const fileItem = result.find((item) => item instanceof MediaWikiFile) as MediaWikiFile;
    expect(fileItem).toBeInstanceOf(MediaWikiFile);
    expect(fileItem.fileName).toBe("Test Article newspost.jpg");
  });

  test("should not crash and should omit image when neither src nor data-src is present", async () => {
    const html = `
      <div class="news-article-header__date">06 March 2026</div>
      <div id="osrsSummaryImage">
        <img alt="Test" />
      </div>
    `;

    const result = await newsHeader.format(html, url, title);
    const fileItem = result.find((item) => item instanceof MediaWikiFile);
    expect(fileItem).toBeUndefined();
  });

  test("should not crash and should omit image when image element is absent", async () => {
    const html = `
      <div class="news-article-header__date">06 March 2026</div>
    `;

    const result = await newsHeader.format(html, url, title);
    const fileItem = result.find((item) => item instanceof MediaWikiFile);
    expect(fileItem).toBeUndefined();
  });
});
