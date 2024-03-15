import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import detailsParser from "../details";

describe("summary node", () => {
  test("summary elements should parse and render", () => {
    const root = parse("<details><summary>test</summary><b>test</b></details>");
    const builder = new MediaWikiBuilder();
    builder.addContents([detailsParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
