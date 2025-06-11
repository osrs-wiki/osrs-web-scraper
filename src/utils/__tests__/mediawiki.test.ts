import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";

import { getFirstStringContent, isEmpty, startsWith, trim } from "../mediawiki";

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
});
