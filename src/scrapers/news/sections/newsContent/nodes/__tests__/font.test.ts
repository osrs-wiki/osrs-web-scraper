import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import fontParser from "../font";

describe("font node", () => {
  test("Font node should parse and render a 2-level header", () => {
    const root = parse(
      '<font style="font-family:Cinzel,serif;font-size:22px;font-weight:bold;color:#FFFFFF;text-shadow:1px 1px #121212;">test</font>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([fontParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Font node should parse and render a 3-level header", () => {
    const root = parse(
      '<font style="font-size:18px;font-weight:bold;color:#000000;">test</font>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([fontParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
