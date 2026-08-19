import { MediaWikiBuilder, MediaWikiFile } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import videoParser from "../video";

describe("video node", () => {
  beforeEach(() => {
    jest.spyOn(fs, "existsSync").mockImplementation(() => false);
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => "");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Video node should parse and render", () => {
    const root = parse(
      '<video controls="controls" width="600"><source src="https://cdn.runescape.com/assets/video.mp4"></video>'
    );

    const builder = new MediaWikiBuilder();
    builder.addContents(
      [videoParser(root.firstChild, { title: "test-title" })].flat()
    );
    expect(builder.build()).toMatchSnapshot();
  });

  test("Video node with center option should include center param", () => {
    const root = parse(
      '<video controls="controls" width="600"><source src="https://cdn.runescape.com/assets/video.mp4"></video>'
    );

    const result = videoParser(root.firstChild, {
      title: "test-title",
      center: true,
    });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.options?.horizontalAlignment).toBe("center");

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });

  test("Video node with a src on the video tag itself (no source child) should parse and render", () => {
    const root = parse(
      '<video src="https://cdn.runescape.com/assets/video.mp4" preload="metadata" playsinline poster="https://cdn.runescape.com/assets/thumb.jpg" autoplay loop controls muted></video>'
    );

    const result = videoParser(root.firstChild, { title: "test-title" });
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiFile);
    const file = content[0] as MediaWikiFile;
    expect(file.fileName).toContain(".mp4");

    const builder = new MediaWikiBuilder();
    builder.addContents(content);
    expect(builder.build()).toMatchSnapshot();
  });
});
