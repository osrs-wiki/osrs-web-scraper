import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import divParser from "../div";

describe("div node", () => {
  test("poll-box class should parse and render", () => {
    const root = parse(
      "<div class='poll-box'><p>Question #X:</p><p><b>If While Guthix Sleeps is added to the game, should we continue to explore the idea of offering the Rites of Balance as a rewards from the quest? This question is for developer consideration and not binding.</b></p></div>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("thumb-row class should be ignored and not render", () => {
    const root = parse(
      '<div class="thumb-row" id="thumbnails"><img src="image1.png" alt="thumbnail 1"><img src="image2.png" alt="thumbnail 2"></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
