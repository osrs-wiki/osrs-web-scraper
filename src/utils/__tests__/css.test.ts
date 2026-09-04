import { HTMLElement } from "node-html-parser";

import {
  extractBackgroundColor,
  extractBackgroundImageUrl,
  extractBackgroundImages,
} from "../css";

describe("CSS utils", () => {
  describe("extractBackgroundColor", () => {
    test("should extract hex background-color", () => {
      const style = "background-color: #78ddeb;";
      expect(extractBackgroundColor(style)).toBe("#78ddeb");
    });

    test("should extract background-color without a trailing semicolon", () => {
      const style = "background-color: #78ddeb";
      expect(extractBackgroundColor(style)).toBe("#78ddeb");
    });

    test("should extract background-color alongside other declarations", () => {
      const style =
        "color: red; background-color: rgb(120, 221, 235); font-size: 14px;";
      expect(extractBackgroundColor(style)).toBe("rgb(120, 221, 235)");
    });

    test("should return null for style without background-color", () => {
      const style = "color: red; font-size: 14px;";
      expect(extractBackgroundColor(style)).toBe(null);
    });

    test("should return null for empty or undefined style", () => {
      expect(extractBackgroundColor("")).toBe(null);
      expect(extractBackgroundColor(undefined)).toBe(null);
    });
  });

  describe("extractBackgroundImageUrl", () => {
    test("should extract URL from simple background-image style", () => {
      const style = "background-image: url(https://example.com/image.png);";
      expect(extractBackgroundImageUrl(style)).toBe(
        "https://example.com/image.png"
      );
    });

    test("should extract URL from background-image with double quotes", () => {
      const style = 'background-image: url("https://example.com/image.png");';
      expect(extractBackgroundImageUrl(style)).toBe(
        "https://example.com/image.png"
      );
    });

    test("should extract URL from background-image with single quotes", () => {
      const style = "background-image: url('https://example.com/image.png');";
      expect(extractBackgroundImageUrl(style)).toBe(
        "https://example.com/image.png"
      );
    });

    test("should handle HTML entity encoded quotes", () => {
      const style =
        "background-image: url(&quot;https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/1SD.png&quot;);";
      expect(extractBackgroundImageUrl(style)).toBe(
        "https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/1SD.png"
      );
    });

    test("should return null for style without background-image", () => {
      const style = "color: red; font-size: 14px;";
      expect(extractBackgroundImageUrl(style)).toBe(null);
    });

    test("should return null for empty or null style", () => {
      expect(extractBackgroundImageUrl("")).toBe(null);
      expect(extractBackgroundImageUrl(null as string)).toBe(null);
    });
  });

  describe("extractBackgroundImages", () => {
    test("should extract background images from elements with style attributes", () => {
      const elements = [
        {
          attributes: {
            style: "background-image: url(https://example.com/image1.png);",
          },
        },
        {
          attributes: {
            style: "background-image: url(https://example.com/image2.jpg);",
          },
        },
        { attributes: { style: "color: red;" } }, // no background-image
        { attributes: {} }, // no style
      ] as HTMLElement[];

      const result = extractBackgroundImages(elements);
      expect(result).toEqual([
        "https://example.com/image1.png",
        "https://example.com/image2.jpg",
      ]);
    });

    test("should return empty array when no background images found", () => {
      const elements = [
        { attributes: { style: "color: red;" } },
        { attributes: {} },
      ] as HTMLElement[];

      const result = extractBackgroundImages(elements);
      expect(result).toEqual([]);
    });
  });
});
