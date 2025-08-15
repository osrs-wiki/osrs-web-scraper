import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import titleParser from "../title";

describe("title node", () => {
  test("Smalltitle tag should parse and render as level 3 header", () => {
    const root = parse("<smalltitle>Test</smalltitle>");
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Bigtitle tag should parse and render as level 2 header", () => {
    const root = parse("<bigtitle>Test</bigtitle>");
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Smalltitle with complex content should parse correctly", () => {
    const root = parse("<smalltitle>Test with <b>bold</b> text</smalltitle>");
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Bigtitle with complex content should parse correctly", () => {
    const root = parse("<bigtitle>Test with <i>italic</i> text</bigtitle>");
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});