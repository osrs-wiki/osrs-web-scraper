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
      new MediaWikiText([new MediaWikiText("caption", { italics: true })]),
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
      new MediaWikiText([new MediaWikiText("caption", { italics: true })]),
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

  it("should combine the adjacent MediaWikiFile, MediaWikiBreak and MediaWikiImage with surrounding italics content", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiFile("image"),
      new MediaWikiBreak(),
      new MediaWikiText(
        [
          new MediaWikiText("caption"),
          new MediaWikiLink("linkText", "linkTarget"),
          new MediaWikiBreak(),
        ],
        {
          italics: true,
        }
      ),
      new MediaWikiBreak(),
      new MediaWikiText("You can also discuss this update on our", {
        italics: true,
      }),
      new MediaWikiBreak(),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });
});
