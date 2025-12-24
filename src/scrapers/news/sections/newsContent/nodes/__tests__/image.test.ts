import { MediaWikiBuilder, MediaWikiFile } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import imageParser from "../image";

describe("image node", () => {
  beforeEach(() => {
    jest.spyOn(fs, "existsSync").mockImplementation(() => false);
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => "");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Image node should parse and render", () => {
    const root = parse(
      '<image href="https://test.com/image.png" width="200" />'
    );

    const builder = new MediaWikiBuilder();
    builder.addContents(
      [imageParser(root.firstChild, { title: "test-title" })].flat()
    );
    expect(builder.build()).toMatchSnapshot();
  });

  test("Image with data-caption-text should include italic caption", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-caption-text="This is a test caption." width="500" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.format).toBe("thumb");
    expect(file.options?.horizontalAlignment).toBe("center");
    expect(file.options?.caption).toBeDefined();

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });

  test("Image with both data-caption-text and data-caption-link", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-caption-text="Custom caption text." data-caption-link="https://example.com/" width="600" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.format).toBe("thumb");
    expect(file.options?.horizontalAlignment).toBe("center");
    expect(file.options?.link).toBe("https://example.com/");
    expect(file.options?.caption).toBeDefined();

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });
});
