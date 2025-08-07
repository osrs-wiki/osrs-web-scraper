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

  it("should insert the separator if the text is in children", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiText("test", { bold: true }),
      new MediaWikiBreak(),
      new MediaWikiText([
        new MediaWikiText("The Old School Team.", { italics: true }),
      ]),
    ];
    const transformed = new NewsFooterTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should handle footer text at index 0", () => {
    // Test that the fix for index comparison works correctly when footer text is at the beginning
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("You can also discuss this update on our"),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiText("test", { bold: true }),
    ];
    const transformed = new NewsFooterTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should filter out undefined elements from the result", () => {
    // Test that the transformer safely handles and filters undefined elements
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiText("You can also discuss this update on our"),
    ];

    // Simulate the scenario where undefined elements might be introduced
    const transformed = new NewsFooterTransformer().transform(originalContent);

    // Verify no undefined elements exist in the result
    expect(transformed.every((item) => item != null)).toBe(true);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should handle content with no footer text", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiLink("test", "test"),
      new MediaWikiBreak(),
      new MediaWikiText("test", { bold: true }),
    ];
    const transformed = new NewsFooterTransformer().transform(originalContent);

    // Should return the same content unchanged
    expect(transformed).toEqual(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });
});
