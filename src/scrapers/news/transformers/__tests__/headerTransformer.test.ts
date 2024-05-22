import {
  MediaWikiBreak,
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiText,
  MediaWikiTOC,
} from "@osrs-wiki/mediawiki-builder";

import NewsHeaderTransformer from "../headerTransformer";

describe("NewsHeaderTransformer", () => {
  it("should change bold text to header-3", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiText(" You can also discuss this update on our ", {
        bold: true,
      }),
      new MediaWikiBreak(),
      new MediaWikiText("The Old School Team.", { italics: true }),
    ];
    const transformed = new NewsHeaderTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should not change bold text to header-3", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiText("test", { bold: true }),
      new MediaWikiBreak(),
      new MediaWikiText("The Old School Team.", { italics: true }),
    ];
    const transformed = new NewsHeaderTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });
});
