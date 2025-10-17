import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import headerParser from "../header";

describe("header node", () => {
  test("h1 tag should parse and render as level 2 header", () => {
    const root = parse("<h1>Test Header</h1>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h2 tag should parse and render as level 2 header", () => {
    const root = parse("<h2>Test Header</h2>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h3 tag should parse and render as level 3 header", () => {
    const root = parse("<h3>Test Header</h3>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h4 tag should parse and render as level 4 header", () => {
    const root = parse("<h4>Test Header</h4>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h5 tag should parse and render as bold text", () => {
    const root = parse("<h5>Test Header</h5>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h6 tag should parse and render as italic text", () => {
    const root = parse("<h6>Test Header</h6>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h1 with bold content should parse correctly", () => {
    const root = parse("<h1>Test with <b>bold</b> text</h1>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h2 with italic content should parse correctly", () => {
    const root = parse("<h2>Test with <i>italic</i> text</h2>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h3 with complex content should parse correctly", () => {
    const root = parse("<h3>Test with <b>bold</b> and <i>italic</i></h3>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h4 with link should parse correctly", () => {
    const root = parse(
      "<h4>Test with <a href='https://example.com'>link</a></h4>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h5 with complex content should parse correctly", () => {
    const root = parse("<h5>Test with <i>italic</i> and <b>bold</b></h5>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("h6 with complex content should parse correctly", () => {
    const root = parse("<h6>Test with <b>bold</b> nested content</h6>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Empty h1 should handle correctly", () => {
    const root = parse("<h1></h1>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Empty h5 should handle correctly", () => {
    const root = parse("<h5></h5>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Empty h6 should handle correctly", () => {
    const root = parse("<h6></h6>");
    const builder = new MediaWikiBuilder();
    builder.addContents([headerParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
