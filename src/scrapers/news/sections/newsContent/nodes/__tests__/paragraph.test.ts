import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import paragraphParser from "../paragraph";

describe("p node", () => {
  test("Paragraph should parse and render", () => {
    const root = parse("<p><b>test</b></p>");
    const builder = new MediaWikiBuilder();
    builder.addContents([paragraphParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
