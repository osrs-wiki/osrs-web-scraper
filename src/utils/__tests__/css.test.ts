import { HTMLElement } from "node-html-parser";

import { extractBackgroundImageUrl, extractBackgroundImages } from "../css";

describe("CSS utils", () => {
  describe("extractBackgroundImageUrl", () => {
    test("should extract URL from simple background-image style", () => {
      const style = "background-image: url(https://example.com/image.png);";
      expect(extractBackgroundImageUrl(style)).toBe("https://example.com/image.png");
    });

    test("should extract URL from background-image with double quotes", () => {
      const style = 'background-image: url("https://example.com/image.png");';
      expect(extractBackgroundImageUrl(style)).toBe("https://example.com/image.png");
    });

    test("should extract URL from background-image with single quotes", () => {
      const style = "background-image: url('https://example.com/image.png');";
      expect(extractBackgroundImageUrl(style)).toBe("https://example.com/image.png");
    });

    test("should handle HTML entity encoded quotes", () => {
      const style = "background-image: url(&quot;https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/1SD.png&quot;);";
      expect(extractBackgroundImageUrl(style)).toBe("https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/1SD.png");
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
        { attributes: { style: "background-image: url(https://example.com/image1.png);" } },
        { attributes: { style: "background-image: url(https://example.com/image2.jpg);" } },
        { attributes: { style: "color: red;" } }, // no background-image
        { attributes: {} }, // no style
      ] as HTMLElement[];

      const result = extractBackgroundImages(elements);
      expect(result).toEqual([
        "https://example.com/image1.png",
        "https://example.com/image2.jpg"
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