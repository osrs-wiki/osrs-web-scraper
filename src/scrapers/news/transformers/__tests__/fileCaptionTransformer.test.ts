import {
  MediaWikiBreak,
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiFile,
  MediaWikiLink,
  MediaWikiText,
  MediaWikiTOC,
} from "@osrs-wiki/mediawiki-builder";

import NewsFileCaptionTransformer from "../fileCaptionTransformer";

describe("NewsFileCaptionTransformer", () => {
  it("should combine the adjacent MediaWikiFile, MediaWikiBreak and MediaWikiImage", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("image"),
      new MediaWikiBreak(),
      new MediaWikiText("caption", { italics: true }),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should combine the adjacent MediaWikiFile, MediaWikiBreak and MediaWikiImage with surrounding content", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiFile("image"),
      new MediaWikiBreak(),
      new MediaWikiText("caption", { italics: true }),
      new MediaWikiBreak(),
      new MediaWikiText("You can also discuss this update on our"),
      new MediaWikiBreak(),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should not combine non-adjacent MediaWikiFile, MediaWikiBreak and MediaWikiText", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiFile("image"),
      new MediaWikiBreak(),
      new MediaWikiText("test"),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiText("testitalics", { italics: true }),
      new MediaWikiBreak(),
      new MediaWikiText("The Old School Team.", { italics: true }),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });
});
