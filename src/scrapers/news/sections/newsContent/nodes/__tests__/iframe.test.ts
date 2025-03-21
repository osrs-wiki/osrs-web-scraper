import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import iframeParser from "../iframe";

describe("iframe node", () => {
  test("iframe with youtube link should use Youtube template", () => {
    const root = parse(
      '<iframe data-cookieblock-src="https://youtube.com/embed/test">blah</iframe>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([iframeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("iframe with non-youtube link should use center tag", () => {
    const root = parse(
      '<iframe data-cookieblock-src="https://example.com">blah</iframe>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([iframeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("iframe link should be parsed from src attribute", () => {
    const root = parse('<iframe src="https://example.com">blah</iframe>');
    const builder = new MediaWikiBuilder();
    builder.addContents([iframeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
