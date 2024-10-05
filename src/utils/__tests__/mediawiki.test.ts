import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";

import { trim } from "../mediawiki";

describe("mediawiki utils", () => {
  test("should trim MediaWikiBreak's from the beginning of content", () => {
    const content = new MediaWikiText("content");
    const contents = [
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      content,
    ];
    const trimmedContent = trim(contents);
    expect(trimmedContent).toEqual([content]);
  });

  test("should trim MediaWikiBreak's from the end of content", () => {
    const content = new MediaWikiText("content");
    const contents = [
      content,
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
    ];
    const trimmedContent = trim(contents);
    expect(trimmedContent).toEqual([content]);
  });

  test("should trim MediaWikiBreak's from the both ends of content", () => {
    const content = new MediaWikiText("content");
    const contents = [
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      content,
      new MediaWikiBreak(),
      new MediaWikiBreak(),
    ];
    const trimmedContent = trim(contents);
    expect(trimmedContent).toEqual([content]);
  });
});
