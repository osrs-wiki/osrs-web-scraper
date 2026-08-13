import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import paragraphParser from "../paragraph";

describe("p node", () => {
  test("Paragraph should parse and render", () => {
    const root = parse("<p><b>test</b></p>");
    const builder = new MediaWikiBuilder();
    builder.addContents([paragraphParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Paragraph with leading/trailing indentation whitespace should trim to avoid a stray leading space", () => {
    const root = parse(
      "<p>\n    There's plenty to learn before we let the recruits loose in the Wilderness!\n</p>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([paragraphParser(root.firstChild)].flat());
    const result = builder.build();

    expect(result.startsWith(" ")).toBe(false);
    expect(result).toMatchSnapshot();
  });

  test("Paragraph with mixed inline content should preserve interior spacing while trimming edges", () => {
    const root = parse(
      "<p>\n    Well, that's exactly what <a href='https://www.twitch.tv/katerena'>Katerena</a> is hoping to prove.\n</p>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([paragraphParser(root.firstChild)].flat());
    const result = builder.build();

    expect(result.startsWith(" ")).toBe(false);
    expect(result).toContain(
      "Well, that's exactly what [https://www.twitch.tv/katerena Katerena] is hoping to prove."
    );
    expect(result).toMatchSnapshot();
  });
});
