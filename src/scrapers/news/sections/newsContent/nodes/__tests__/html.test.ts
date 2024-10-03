import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import htmlParser from "../html";

describe("html node", () => {
  test("Tag should parse and render MediaWikiHTML", () => {
    const root = parse("<sub>test</sub>");
    const builder = new MediaWikiBuilder();
    builder.addContents([htmlParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
