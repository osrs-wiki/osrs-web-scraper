import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import galleryParser from "../gallery";

// Mock file system operations
jest.mock("fs");

describe("gallery node", () => {
  test("Gallery should parse and render", () => {
    const existsSyncSpy = jest
      .spyOn(fs, "existsSync")
      .mockImplementationOnce(() => false);
    const mkdirSyncSpy = jest
      .spyOn(fs, "mkdirSync")
      .mockImplementationOnce(() => "");

    const root = parse(`
      <div class="row">
        <img src="https://example.com/image1.png" />
        <img src="https://example.com/image2.jpg" />
      </div>
    `);

    const builder = new MediaWikiBuilder();
    builder.addContents([galleryParser(root, { title: "test-title" })].flat());
    expect(builder.build()).toMatchSnapshot();

    expect(existsSyncSpy).toHaveBeenCalledWith(`./out/news/test-title`);
    expect(mkdirSyncSpy).toHaveBeenCalledWith(`./out/news/test-title`, {
      recursive: true,
    });
  });
});
