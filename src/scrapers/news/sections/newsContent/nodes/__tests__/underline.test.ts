import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import boldParser from "../bold";

describe("underline node", () => {
  test("Underlined text should parse and render", () => {
    const root = parse("<u>test</u>");
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Underlined text should parse and render with a link", () => {
    const root = parse(
      "<u>testing this <a href='https://example.com'>link</a></u>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Underlined text should parse and render with a link and italics", () => {
    const root = parse(
      "<u>testing this <a href='https://example.com'>link</a> and <i>italics</i></u>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Underlined text should parse and render with a link and bold", () => {
    const root = parse(
      "<u>testing this <a href='https://example.com'>link</a> and <b>bold</b></u>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
