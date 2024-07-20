import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import { getWorldLines } from "../worlds.utils";

describe("world scraper utils", () => {
  test("getWorldLines", () => {
    const worldNodes = parse(
      '<tr><td>\n<a href="">OldSchool 101</a></td><td>0 players</td><td>United States</td><td>Members</td><td>111-126 Deadman</td></tr>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents(getWorldLines(worldNodes));
    expect(builder.build()).toMatchSnapshot();
  });
});
