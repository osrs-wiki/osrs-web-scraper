import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import tableParser from "../table";

describe("table node", () => {
  test("A table with no thead should render", () => {
    const root = parse(
      "<table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td>test</td><td>test</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with thead should render", () => {
    const root = parse(
      "<table><thead><tr><td>header1</td><td>header2</td></tr></thead><tbody><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
