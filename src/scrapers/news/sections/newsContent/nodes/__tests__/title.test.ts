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

  test("Unrecognized tag should return text content", () => {
    const root = parse("<customtag>Test content</customtag>");
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Unrecognized tag with complex content should return text content", () => {
    const root = parse(
      "<randomtag>Test with <b>bold</b> and <i>italic</i> text</randomtag>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Empty unrecognized tag should return empty text content", () => {
    const root = parse("<unknowntag></unknowntag>");
    const builder = new MediaWikiBuilder();
    builder.addContents([titleParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
