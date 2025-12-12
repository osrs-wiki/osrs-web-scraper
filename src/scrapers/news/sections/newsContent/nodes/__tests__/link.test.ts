import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import linkParser from "../link";

describe("link node", () => {
  test("Links should parse and render", () => {
    const root = parse("<a href='link'>test</a>");
    const builder = new MediaWikiBuilder();
    builder.addContents([linkParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Empty anchor tag should return undefined", () => {
    const root = parse("<a href='https://example.com'></a>");
    const result = linkParser(root.firstChild);
    expect(result).toBeUndefined();
  });

  test("Anchor tag with only whitespace should still parse", () => {
    const root = parse("<a href='https://example.com'>   </a>");
    const result = linkParser(root.firstChild);
    // rawText.trim() will be empty but the function returns a link with empty text
    expect(result).toBeDefined();
  });

  test("Anchor tag with text should parse correctly", () => {
    const root = parse("<a href='https://example.com'>Click here</a>");
    const builder = new MediaWikiBuilder();
    builder.addContents([linkParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Old School Wiki link should use MediaWikiLink", () => {
    const root = parse("<a href='http://oldschool.runescape.wiki/'>Wiki</a>");
    const builder = new MediaWikiBuilder();
    builder.addContents([linkParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
