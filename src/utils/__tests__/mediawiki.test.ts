import {
  MediaWikiBreak,
  MediaWikiFile,
  MediaWikiTemplate,
  MediaWikiText,
  MediaWikiTOC,
} from "@osrs-wiki/mediawiki-builder";

import {
  escapeTablePipe,
  getFirstStringContent,
  getNextContent,
  isEmpty,
  startsWith,
  trim,
  trimAroundBreaks,
  trimContentEdge,
  trimContentEdges,
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

  describe("trimAroundBreaks", () => {
    test("should trim trailing/leading whitespace on either side of a break", () => {
      const before = new MediaWikiText("before ");
      const after = new MediaWikiText(" after");
      const contents = [before, new MediaWikiBreak(), after];
      trimAroundBreaks(contents);
      expect(before.children).toBe("before");
      expect(after.children).toBe("after");
    });

    test("should do nothing when there are no breaks", () => {
      const content = new MediaWikiText(" content ");
      trimAroundBreaks([content]);
      expect(content.children).toBe(" content ");
    });
  });

  describe("escapeTablePipe", () => {
    test("should escape a literal pipe with the {{!}} template", () => {
      expect(escapeTablePipe("TABLET | Special Attack")).toBe(
        "TABLET {{!}} Special Attack"
      );
    });

    test("should return undefined for undefined input", () => {
      expect(escapeTablePipe(undefined)).toBeUndefined();
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

    test("should return true for undefined", () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    test("should return true for an array containing undefined (e.g. an empty <p></p> with no parseable content)", () => {
      expect(isEmpty([undefined])).toBe(true);
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

    test("should NOT skip over a template or TOC (e.g. `{{clear}}`/`__TOC__` after a header image) even though they have no `children`", () => {
      const clearTemplate = new MediaWikiTemplate("clear");
      const contents = [
        new MediaWikiFile("header image"),
        new MediaWikiBreak(),
        clearTemplate,
        new MediaWikiTOC(),
        new MediaWikiText([new MediaWikiText("caption", { italics: true })]),
      ];
      const result = getNextContent(contents, 1);
      expect(result.content).toBe(clearTemplate);
      expect(result.index).toBe(2);
    });
  });

  describe("trimContentEdge", () => {
    test("should trim leading whitespace from a string child when edge is start", () => {
      const content = new MediaWikiText("   leading space");
      trimContentEdge(content, "start");
      expect(content.children).toBe("leading space");
    });

    test("should trim trailing whitespace from a string child when edge is end", () => {
      const content = new MediaWikiText("trailing space   ");
      trimContentEdge(content, "end");
      expect(content.children).toBe("trailing space");
    });

    test("should not affect interior whitespace", () => {
      const content = new MediaWikiText("  has   interior spaces  ");
      trimContentEdge(content, "start");
      trimContentEdge(content, "end");
      expect(content.children).toBe("has   interior spaces");
    });

    test("should recurse into the first nested MediaWikiText when edge is start", () => {
      const inner = new MediaWikiText("   nested leading space");
      const content = new MediaWikiText([inner, new MediaWikiText("other")]);
      trimContentEdge(content, "start");
      expect(inner.children).toBe("nested leading space");
    });

    test("should recurse into the last nested MediaWikiText when edge is end", () => {
      const inner = new MediaWikiText("nested trailing space   ");
      const content = new MediaWikiText([new MediaWikiText("other"), inner]);
      trimContentEdge(content, "end");
      expect(inner.children).toBe("nested trailing space");
    });

    test("should not modify content that is not a MediaWikiText", () => {
      const content = new MediaWikiBreak();
      expect(() => trimContentEdge(content, "start")).not.toThrow();
    });

    test("should not throw for an empty array of children", () => {
      const content = new MediaWikiText([]);
      expect(() => trimContentEdge(content, "start")).not.toThrow();
      expect(content.children).toEqual([]);
    });
  });

  describe("trimContentEdges", () => {
    test("should trim leading whitespace from the first element and trailing whitespace from the last element", () => {
      const contents = [
        new MediaWikiText("   leading"),
        new MediaWikiText("middle"),
        new MediaWikiText("trailing   "),
      ];
      trimContentEdges(contents);
      expect(contents[0].children).toBe("leading");
      expect(contents[1].children).toBe("middle");
      expect(contents[2].children).toBe("trailing");
    });

    test("should trim both edges of a single-element array", () => {
      const contents = [new MediaWikiText("   both edges   ")];
      trimContentEdges(contents);
      expect(contents[0].children).toBe("both edges");
    });

    test("should not throw for an empty array", () => {
      expect(() => trimContentEdges([])).not.toThrow();
    });

    test("should not throw for a null or undefined array", () => {
      expect(() =>
        trimContentEdges(null as unknown as MediaWikiText[])
      ).not.toThrow();
      expect(() =>
        trimContentEdges(undefined as unknown as MediaWikiText[])
      ).not.toThrow();
    });
  });
});
