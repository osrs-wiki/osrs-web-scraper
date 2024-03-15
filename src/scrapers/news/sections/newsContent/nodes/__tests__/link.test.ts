import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import linkParser from "../link";

describe("link node", () => {
  test("Links should parse and render", () => {
    const root = parse("<a href='link'>test</a>");
    const builder = new MediaWikiBuilder();
    builder.addContents([linkParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
