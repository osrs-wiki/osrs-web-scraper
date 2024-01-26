import {
  MediaWikiBreak,
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiLink,
  MediaWikiText,
  MediaWikiTOC,
} from "@osrs-wiki/mediawiki-builder";

import NewsFooterTransformer from "../footerTransformer";

describe("NewsFooterTransformer", () => {
  it("should insert the separator in front of social media discussion section", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiText("test", { bold: true }),
      new MediaWikiBreak(),
      new MediaWikiText("You can also discuss this update on our"),
      new MediaWikiBreak(),
      new MediaWikiText("Mods test, test and test", { bold: true }),
      new MediaWikiBreak(),
      new MediaWikiText("The Old School Team.", { italics: true }),
    ];
    const transformed = new NewsFooterTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should insert the separator in front of oldschool team section", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiText("test", { bold: true }),
      new MediaWikiBreak(),
      new MediaWikiText("The Old School Team.", { italics: true }),
    ];
    const transformed = new NewsFooterTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });
});
