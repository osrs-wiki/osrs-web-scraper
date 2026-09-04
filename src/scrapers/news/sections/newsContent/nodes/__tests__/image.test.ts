import { MediaWikiBuilder, MediaWikiFile } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import { ContentContext } from "../../newsContent";
import imageParser from "../image";

describe("image node", () => {
  beforeEach(() => {
    ContentContext.imageCount = 0;
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

  test("Image with data-width attribute should use that width", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-width="200" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.resizing?.width).toBe(200);

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });

  test("Image with inline style width should use that width", () => {
    const root = parse(
      '<img src="https://test.com/image.png" style="width: 300px;" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.resizing?.width).toBe(300);

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });

  test("Image with style containing max-width should not be mistaken for width", () => {
    const root = parse(
      '<img src="https://test.com/image.png" style="max-width: 800px; width: 300px;" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.resizing?.width).toBe(300);
  });

  test("Image with only max-width in style should fall back to sizeOf/default", () => {
    const root = parse(
      '<img src="https://test.com/image.png" style="max-width: 800px;" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    // No usable width source (no width/data-width/style width, and no real file on disk),
    // so it should fall back to the default of 600, not the max-width value of 800.
    expect(file.options?.resizing?.width).toBe(600);
  });

  test("width attribute takes priority over data-width", () => {
    const root = parse(
      '<img src="https://test.com/image.png" width="150" data-width="400" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.resizing?.width).toBe(150);
  });

  test("Image with data-link-href attribute should use that as the file link", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-width="200" data-link-href="https://example.com/platform" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.link).toBe("https://example.com/platform");

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });

  test("Image with data-caption-href attribute should use that as the file link", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-width="200" data-caption-href="https://example.com/caption-link" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.link).toBe("https://example.com/caption-link");
  });

  test("data-caption-link takes priority over data-caption-href", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-width="200" data-caption-link="https://example.com/link" data-caption-href="https://example.com/href" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.link).toBe("https://example.com/link");
  });

  test("Image with asset-auto-sized class should be centered even without a caption or center wrapper", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-width="255px" class="asset-auto-sized" style="width: 255px; max-width: 100%; height: auto;" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.horizontalAlignment).toBe("center");
    expect(file.options?.resizing?.width).toBe(255);

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });

  test("Image wrapped in an asset-link anchor should be centered", () => {
    const root = parse(
      '<a class="asset-link" href="https://test.com/image.png" target="_blank" rel="noopener noreferrer"><img src="https://test.com/image.png" data-width="450px" class="asset-auto-sized" style="width: 450px; max-width: 100%; height: auto;"></a>'
    );
    const img = root.querySelector("img");

    const result = imageParser(img, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.horizontalAlignment).toBe("center");
    expect(file.options?.link).toBeUndefined();
  });

  test("data-caption-href takes priority over data-link-href", () => {
    const root = parse(
      '<img src="https://test.com/image.png" data-width="200" data-caption-href="https://example.com/caption" data-link-href="https://example.com/link-href" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.link).toBe("https://example.com/caption");
  });

  test("Image with divider class should be ignored", () => {
    const root = parse(
      '<img src="https://test.com/image.png" class="divider" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });

    expect(result).toBeUndefined();
  });

  test("Image with demo cursor class should be ignored", () => {
    const root = parse(
      '<img src="https://test.com/image.png" class="demo cursor" />'
    );

    const result = imageParser(root.firstChild, { title: "test-title" });

    expect(result).toBeUndefined();
  });

  test("Image ending in hr.png should be ignored", () => {
    const root = parse('<img src="https://test.com/hr.png" />');

    const result = imageParser(root.firstChild, { title: "test-title" });

    expect(result).toBeUndefined();
  });
});
