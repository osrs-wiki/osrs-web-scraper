import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import listParser from "../list";

describe("list node", () => {
  test("list should parse and render", () => {
    const root = parse("<ul><li>test1</li><li>test2</li></ul>");
    const builder = new MediaWikiBuilder();
    builder.addContents([listParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("list should ignore breaks", () => {
    const root = parse("<ul><li>test1</li><br/><li>test2</li><br/></ul>");
    const builder = new MediaWikiBuilder();
    builder.addContents([listParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
