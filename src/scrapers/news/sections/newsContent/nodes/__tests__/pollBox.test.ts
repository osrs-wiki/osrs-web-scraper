import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import pollBoxParser from "../div/pollBox";

describe("pollBox", () => {
  test("poll-box with question returns news poll", () => {
    const root = parse(
      '<div class="poll-box"><p>Question #3</p><p><b>here is the question</b></p></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("poll-box with no poll question returns letter", () => {
    const root = parse(
      '<div class="poll-box"><br/><br/><p><i>header</i></p><p><b>here is the content</b></p><br/><br/></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
