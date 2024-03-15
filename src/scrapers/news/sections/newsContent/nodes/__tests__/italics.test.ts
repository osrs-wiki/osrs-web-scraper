import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import italicsParser from "../italics";

describe("italics node", () => {
  test("Italic text should parse and render", () => {
    const root = parse("<b>test</b>");
    const builder = new MediaWikiBuilder();
    builder.addContents([italicsParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
