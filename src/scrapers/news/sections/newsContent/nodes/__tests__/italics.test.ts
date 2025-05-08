import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import italicsParser from "../italics";

describe("italics node", () => {
  test("Italic text should parse and render", () => {
    const root = parse("<i>test</i>");
    const builder = new MediaWikiBuilder();
    builder.addContents([italicsParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Italic text should parse and render with a link", () => {
    const root = parse(
      "<i>testing this <a href='https://example.com'>link</a></i>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([italicsParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Italic text should parse and render with a link and bold", () => {
    const root = parse(
      "<i>testing this <a href='https://example.com'>link</a> and <b>bold</b></i>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([italicsParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
