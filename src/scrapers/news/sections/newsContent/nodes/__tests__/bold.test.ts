import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import boldParser from "../bold";

describe("bold node", () => {
  test("Bold text should parse and render", () => {
    const root = parse("<b>test</b>");
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Bold text should parse and render with a link", () => {
    const root = parse(
      "<b>testing this <a href='https://example.com'>link</a></b>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
  test("Bold text should parse and render with a link and italics", () => {
    const root = parse(
      "<b>testing this <a href='https://example.com'>link</a> and <i>italics</i></b>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
