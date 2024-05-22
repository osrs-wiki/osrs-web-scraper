import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import imageParser from "../image";

describe("image node", () => {
  test("Image node should parse and render", () => {
    const existsSyncSpy = jest.spyOn(fs, "existsSync");
    const mkdirSyncSpy = jest.spyOn(fs, "mkdirSync");

    const root = parse(
      '<image href="https://test.com/image.png" width="200" />'
    );

    const builder = new MediaWikiBuilder();
    builder.addContents(
      [imageParser(root.firstChild, { title: "test-title" })].flat()
    );
    expect(builder.build()).toMatchSnapshot();

    expect(existsSyncSpy).toHaveBeenCalledWith(`./out/news/test-title`);
    expect(mkdirSyncSpy).toHaveBeenCalledWith(`./out/news/test-title`, {
      recursive: true,
    });
  });
});
