import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import spanParser from "../span";

describe("span node", () => {
  test("Span should parse and render", () => {
    const root = parse("<span><b>test</b></span>");
    const builder = new MediaWikiBuilder();
    builder.addContents([spanParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Span with font color should parse and render", () => {
    const root = parse("<span style='color: #ffff00'><b>test</b></span>");
    const builder = new MediaWikiBuilder();
    builder.addContents([spanParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
