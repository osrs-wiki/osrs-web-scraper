import fs from "fs";

import * as fileUtils from "../../../../../utils/file";
import newsContent from "../newsContent";

describe("newsContent", () => {
  beforeEach(() => {
    jest.spyOn(fs, "existsSync").mockImplementation(() => true);
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => "");
    jest.spyOn(fs, "readdirSync").mockImplementation(() => []);
    jest.spyOn(fileUtils, "downloadFile").mockResolvedValue("");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("downloads regular images", async () => {
    const html = '<img src="https://test.com/image.png" />';

    await newsContent.format(html, "https://test.com", "test title");

    expect(fileUtils.downloadFile).toHaveBeenCalledWith(
      "https://test.com/image.png",
      expect.any(String)
    );
  });

  test("skips images with an ignored divider class", async () => {
    const html =
      '<img src="https://test.com/image.png" class="divider" /><img src="https://test.com/other.png" />';

    await newsContent.format(html, "https://test.com", "test title");

    expect(fileUtils.downloadFile).not.toHaveBeenCalledWith(
      "https://test.com/image.png",
      expect.any(String)
    );
    expect(fileUtils.downloadFile).toHaveBeenCalledWith(
      "https://test.com/other.png",
      expect.any(String)
    );
  });

  test("skips images with the demo cursor classes", async () => {
    const html =
      '<img src="https://test.com/cursor.png" class="demo cursor" /><img src="https://test.com/cursor-active.png" class="demo cursor active" />';

    await newsContent.format(html, "https://test.com", "test title");

    expect(fileUtils.downloadFile).not.toHaveBeenCalled();
  });

  test("skips images ending in hr.png", async () => {
    const html = '<img src="https://test.com/hr.png" />';

    await newsContent.format(html, "https://test.com", "test title");

    expect(fileUtils.downloadFile).not.toHaveBeenCalled();
  });
});
