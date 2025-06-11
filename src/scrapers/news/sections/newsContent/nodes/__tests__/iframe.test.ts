import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import iframeParser from "../iframe";

describe("iframe node", () => {
  test("iframe with youtube link should use Youtube template", () => {
    const root = parse(
      '<iframe data-cookieblock-src="https://www.youtube.com/embed/80pYF2u-lJo?si=eQouUlth2Sko8b46">blah</iframe>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([iframeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("iframe with youtube playlist link should use Youtube template with type=playlist", () => {
    const root = parse(
      '<iframe data-cookieblock-src="https://www.youtube.com/embed/videoseries?si=rh-lb4jty9OTAKAM&list=PLRs68iqW7gYvSyTqu12WFMMXYZM-2regV">blah</iframe>'
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
