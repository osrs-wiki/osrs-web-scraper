import { MediaWikiBreak, MediaWikiText } from "@osrs-wiki/mediawiki-builder";

import { getFirstStringContent, startsWith, trim } from "../mediawiki";

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
