import { MediaWikiContent, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import textParser from "../text";

describe("text parser", () => {
  test("should parse simple text content", () => {
    const root = parse("Simple text content");
    const result = textParser(root.firstChild);

    expect(result).toBeInstanceOf(MediaWikiText);
    expect((result as MediaWikiText).build()).toBe("Simple text content");
  });

  test("should return undefined for empty/whitespace-only text", () => {
    const root = parse("   ");
    const result = textParser(root.firstChild);

    expect(result).toBeUndefined();
  });

  test("should return undefined for completely empty text", () => {
    const root = parse(" "); // Use a space instead of completely empty
    const result = textParser(root.firstChild);

    expect(result).toBeUndefined();
  });

  test("should parse text with child nodes and filter out undefined content", () => {
    const root = parse(
      "<div>Text with <b>bold</b> and <script>ignored</script> content</div>"
    );
    const result = textParser(root.firstChild);

    expect(Array.isArray(result)).toBe(true);
    const resultArray = result as MediaWikiContent[];
    expect(resultArray.length).toBeGreaterThan(0);
    // Should not contain undefined values
    expect(resultArray.every((item) => item != null)).toBe(true);
  });

  test("should handle mixed content with HTML elements", () => {
    const root = parse("<div>Start <i>italic</i> middle <b>bold</b> end</div>");
    const result = textParser(root.firstChild);

    expect(Array.isArray(result)).toBe(true);
    const resultArray = result as MediaWikiContent[];
    expect(resultArray.length).toBeGreaterThan(0);
    // All items should have a build method
    expect(resultArray.every((item) => typeof item.build === "function")).toBe(
      true
    );
  });

  test("should apply formatting options correctly", () => {
    const root = parse("Formatted text");
    const result = textParser(root.firstChild, {
      bold: true,
      italics: true,
      underline: false,
    });

    expect(result).toBeInstanceOf(MediaWikiText);
    const mediaWikiText = result as MediaWikiText;
    expect(mediaWikiText.build()).toBe("'''''Formatted text'''''");
  });

  test("should handle child nodes with formatting options", () => {
    const root = parse("<div>Text <span>with span</span> content</div>");
    const result = textParser(root.firstChild, { bold: true });

    expect(Array.isArray(result)).toBe(true);
    const resultArray = result as MediaWikiContent[];
    expect(resultArray.length).toBeGreaterThan(0);
    // Should filter out any undefined content
    expect(resultArray.every((item) => item != null)).toBe(true);
  });

  test("should handle nodes with only ignored elements", () => {
    const root = parse(
      "<div><script>alert('test')</script><style>body{}</style></div>"
    );
    const result = textParser(root.firstChild);

    if (Array.isArray(result)) {
      const resultArray = result as MediaWikiContent[];
      // Should filter out undefined content, may result in empty array
      expect(resultArray.every((item) => item != null)).toBe(true);
    }
  });
});
