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

  it("should skip files that already have captions", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("image", {
        caption: new MediaWikiText("existing caption", { italics: true }),
      }),
      new MediaWikiBreak(),
      new MediaWikiText([
        new MediaWikiText("another caption", { italics: true }),
      ]),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );

    // Should not combine since file already has caption
    expect(transformed).toHaveLength(3);
    expect(transformed[0]).toBeInstanceOf(MediaWikiFile);
    const file = transformed[0] as MediaWikiFile;
    expect(file.options?.caption).toBeInstanceOf(MediaWikiText);

    const builder = new MediaWikiBuilder().addContents(transformed);
    expect(builder.build()).toMatchSnapshot();
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

  it("should combine file and caption with multiple breaks in between", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("image"),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
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

  it("should combine file and caption with breaks and empty text in between", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("image"),
      new MediaWikiBreak(),
      new MediaWikiText(""),
      new MediaWikiBreak(),
      new MediaWikiText("   "),
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
});
