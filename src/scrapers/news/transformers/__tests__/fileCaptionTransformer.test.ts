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

  it("should override an existing (e.g. truncated data-caption-text) caption with the full following caption", () => {
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

    // Should combine, with the following full caption taking precedence
    expect(transformed).toHaveLength(1);
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

  it("should NOT combine an image with a plain (non-italicised) following paragraph (e.g. the article's own next paragraph)", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("image (1).png"),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiText([new MediaWikiText("Just the next paragraph.")]),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );

    expect(transformed).toHaveLength(4);
    expect(transformed[0]).toBeInstanceOf(MediaWikiFile);
    const file = transformed[0] as MediaWikiFile;
    expect(file.options?.format).toBeUndefined();
    expect(file.options?.caption).toBeUndefined();
  });

  it("should combine an image with an italicised following paragraph (e.g. a real caption)", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("image (1).png"),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiText([
        new MediaWikiText("A real caption", { italics: true }),
      ]),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );

    expect(transformed).toHaveLength(1);
    expect(transformed[0]).toBeInstanceOf(MediaWikiFile);
    const file = transformed[0] as MediaWikiFile;
    expect(file.options?.format).toBe("thumb");
  });

  it("should NOT combine a video with a plain (non-italicised) following paragraph (e.g. surrounding narrative text)", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("video (1).mp4"),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiText([new MediaWikiText("Just the next paragraph.")]),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );

    expect(transformed).toHaveLength(4);
    expect(transformed[0]).toBeInstanceOf(MediaWikiFile);
    const file = transformed[0] as MediaWikiFile;
    expect(file.options?.format).toBeUndefined();
    expect(file.options?.caption).toBeUndefined();
  });

  it("should combine a video with an italicised following paragraph (e.g. a real caption)", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiFile("video (1).mp4"),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiText([
        new MediaWikiText("A real caption", { italics: true }),
      ]),
    ];
    const transformed = new NewsFileCaptionTransformer().transform(
      originalContent
    );

    expect(transformed).toHaveLength(1);
    expect(transformed[0]).toBeInstanceOf(MediaWikiFile);
    const file = transformed[0] as MediaWikiFile;
    expect(file.options?.format).toBe("thumb");
  });
});
