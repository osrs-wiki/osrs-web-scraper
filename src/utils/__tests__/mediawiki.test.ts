import {
  MediaWikiBreak,
  MediaWikiFile,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";

import {
  getFirstStringContent,
  getNextContent,
  isEmpty,
  startsWith,
  trim,
} from "../mediawiki";

describe("mediawiki utils", () => {
  describe("trim", () => {
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

  describe("startsWith", () => {
    test("should return true if the first child starts with the given string", () => {
      const contents = [
        new MediaWikiText("content"),
        new MediaWikiText("other content"),
      ];
      const result = startsWith(contents, "content");
      expect(result).toBe(true);
    });

    test("should return false if the first child does not start with the given string", () => {
      const contents = [
        new MediaWikiText("other content"),
        new MediaWikiText("content"),
      ];
      const result = startsWith(contents, "content");
      expect(result).toBe(false);
    });

    test("should return true if the first child is a string and starts with the given string", () => {
      const contents = "content";
      const result = startsWith(contents, "content");
      expect(result).toBe(true);
    });

    test("should return false if the first child is a string and does not start with the given string", () => {
      const contents = "other content";
      const result = startsWith(contents, "content");
      expect(result).toBe(false);
    });

    test("should return true if the first child is a MediaWikiText with an array of children and the first child starts with the given string", () => {
      const contents = [
        new MediaWikiText([
          new MediaWikiText("content"),
          new MediaWikiText("other content"),
        ]),
      ];
      const result = startsWith(contents, "content");
      expect(result).toBe(true);
    });

    test("should return false if the first child is a MediaWikiText with an array of children and the first child does not start with the given string", () => {
      const contents = [
        new MediaWikiText([
          new MediaWikiText("other content"),
          new MediaWikiText("content"),
        ]),
      ];
      const result = startsWith(contents, "content");
      expect(result).toBe(false);
    });

    test("should handle empty array without throwing error", () => {
      const contents: MediaWikiText[] = [];
      const result = startsWith(contents, "content");
      expect(result).toBe(false);
    });

    test("should handle array with undefined elements without throwing error", () => {
      const contents = [undefined] as unknown as MediaWikiText[];
      const result = startsWith(contents, "content");
      expect(result).toBe(false);
    });
  });

  describe("isEmpty", () => {
    test("should return true for an empty string", () => {
      expect(isEmpty("")).toBe(true);
    });

    test("should return true for a string with only whitespace", () => {
      expect(isEmpty("   ")).toBe(true);
    });

    test("should return false for a non-empty string", () => {
      expect(isEmpty("content")).toBe(false);
    });

    test("should return true for an empty array", () => {
      expect(isEmpty([])).toBe(true);
    });

    test("should return true for an array of empty MediaWikiText objects", () => {
      expect(isEmpty([new MediaWikiText("")])).toBe(true);
    });

    test("should return true for an array of MediaWikiText objects with empty strings", () => {
      expect(isEmpty([new MediaWikiText(""), new MediaWikiText("   ")])).toBe(
        true
      );
    });

    test("should return false for an array with a non-empty MediaWikiText object", () => {
      expect(isEmpty([new MediaWikiText("content")])).toBe(false);
    });

    test("should return false for an array with mixed empty and non-empty MediaWikiText objects", () => {
      expect(
        isEmpty([new MediaWikiText(""), new MediaWikiText("content")])
      ).toBe(false);
    });

    test("should return false for a single non-array MediaWikiContent object (MediaWikiText)", () => {
      // This hits the final `return false` in isEmpty, as it's not a string or array.
      expect(isEmpty(new MediaWikiText("content"))).toBe(false);
    });

    test("should return true for an empty MediaWikiContent", () => {
      expect(isEmpty(new MediaWikiText(""))).toBe(true);
    });

    test("should return true for an array of MediaWikiContent where all are recursively empty strings", () => {
      const contents = [new MediaWikiText(""), new MediaWikiText("   ")];
      expect(isEmpty(contents)).toBe(true);
    });

    test("should return false for an array of MediaWikiContent where at least one is not an empty string", () => {
      const contents = [
        new MediaWikiText(""),
        new MediaWikiText("hello"),
        new MediaWikiText("   "),
      ];
      expect(isEmpty(contents)).toBe(false);
    });

    test("should return true for an array of MediaWikiContent where all are recursively empty strings", () => {
      const contents = [new MediaWikiText(""), new MediaWikiText("   ")];
      expect(isEmpty(contents)).toBe(true);
    });
  });

  describe("getFirstStringContent", () => {
    test("should return the first string content", () => {
      const contents = [
        new MediaWikiText("content"),
        new MediaWikiText("other content"),
      ];
      const result = getFirstStringContent(contents[0]);
      expect(result).toEqual(contents[0]);
    });

    test("should return the first string content from nested MediaWikiText", () => {
      const contents = [
        new MediaWikiText([
          new MediaWikiText("other content"),
          new MediaWikiText("content"),
        ]),
      ];
      const result = getFirstStringContent(contents[0]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Ignore any for testing
      expect(result).toBe(contents[0].children[0]);
    });

    test("should return the first string content from nested MediaWikiText with multiple levels", () => {
      const contents = [
        new MediaWikiText([
          new MediaWikiText([
            new MediaWikiText("content"),
            new MediaWikiText("more content"),
          ]),
          new MediaWikiText("other content"),
        ]),
      ];
      const result = getFirstStringContent(contents[0]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Ignore any for testing
      expect(result).toEqual(contents[0].children[0].children[0]);
    });
  });

  describe("getNextContent", () => {
    test("should return the next non-break content", () => {
      const contents = [
        new MediaWikiFile("image"),
        new MediaWikiBreak(),
        new MediaWikiText("caption"),
      ];
      const result = getNextContent(contents, 1);
      expect(result.content).toBe(contents[2]);
      expect(result.index).toBe(2);
    });

    test("should skip multiple breaks", () => {
      const contents = [
        new MediaWikiFile("image"),
        new MediaWikiBreak(),
        new MediaWikiBreak(),
        new MediaWikiBreak(),
        new MediaWikiText("caption"),
      ];
      const result = getNextContent(contents, 1);
      expect(result.content).toBe(contents[4]);
      expect(result.index).toBe(4);
    });

    test("should skip empty text content", () => {
      const contents = [
        new MediaWikiFile("image"),
        new MediaWikiBreak(),
        new MediaWikiText(""),
        new MediaWikiText("   "),
        new MediaWikiText("caption"),
      ];
      const result = getNextContent(contents, 1);
      expect(result.content).toBe(contents[4]);
      expect(result.index).toBe(4);
    });

    test("should return null when no content found", () => {
      const contents = [
        new MediaWikiFile("image"),
        new MediaWikiBreak(),
        new MediaWikiBreak(),
      ];
      const result = getNextContent(contents, 1);
      expect(result.content).toBeNull();
      expect(result.index).toBe(-1);
    });

    test("should return first content after startIndex", () => {
      const contents = [
        new MediaWikiText("first"),
        new MediaWikiBreak(),
        new MediaWikiFile("image"),
        new MediaWikiBreak(),
        new MediaWikiText("caption"),
      ];
      const result = getNextContent(contents, 3);
      expect(result.content).toBe(contents[4]);
      expect(result.index).toBe(4);
    });

    test("should skip breaks and empty text in complex scenario", () => {
      const contents = [
        new MediaWikiFile("image"),
        new MediaWikiBreak(),
        new MediaWikiBreak(),
        new MediaWikiText(""),
        new MediaWikiBreak(),
        new MediaWikiText([new MediaWikiText("caption", { italics: true })]),
      ];
      const result = getNextContent(contents, 1);
      expect(result.content).toBe(contents[5]);
      expect(result.index).toBe(5);
    });
  });
});
