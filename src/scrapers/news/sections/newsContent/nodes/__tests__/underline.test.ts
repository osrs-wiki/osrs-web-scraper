import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import boldParser from "../bold";

describe("underline node", () => {
  test("Underlined text should parse and render", () => {
    const root = parse("<u>test</u>");
    const builder = new MediaWikiBuilder();
    builder.addContents([boldParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
