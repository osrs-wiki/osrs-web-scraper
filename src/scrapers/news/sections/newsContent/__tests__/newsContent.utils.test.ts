import { parse, HTMLElement } from "node-html-parser";

import { isWithinThumbnails } from "../newsContent.utils";

describe("newsContent.utils", () => {
  describe("isWithinThumbnails", () => {
    test("returns true when element is directly within thumbnails container", () => {
      const html = `
        <div id="thumbnails">
          <img src="image1.png" alt="test">
        </div>
      `;
      const root = parse(html);
      const imgElement = root.querySelector("img") as HTMLElement;
      
      expect(isWithinThumbnails(imgElement)).toBe(true);
    });

    test("returns true when element is nested within thumbnails container", () => {
      const html = `
        <div id="thumbnails">
          <div class="thumb-row">
            <img src="image1.png" alt="test">
          </div>
        </div>
      `;
      const root = parse(html);
      const imgElement = root.querySelector("img") as HTMLElement;
      
      expect(isWithinThumbnails(imgElement)).toBe(true);
    });

    test("returns false when element is not within thumbnails container", () => {
      const html = `
        <div class="content">
          <img src="image1.png" alt="test">
        </div>
      `;
      const root = parse(html);
      const imgElement = root.querySelector("img") as HTMLElement;
      
      expect(isWithinThumbnails(imgElement)).toBe(false);
    });

    test("returns false when element has thumbnails class but not id", () => {
      const html = `
        <div class="thumbnails">
          <img src="image1.png" alt="test">
        </div>
      `;
      const root = parse(html);
      const imgElement = root.querySelector("img") as HTMLElement;
      
      expect(isWithinThumbnails(imgElement)).toBe(false);
    });

    test("returns false when element is in different container with id", () => {
      const html = `
        <div id="gallery">
          <img src="image1.png" alt="test">
        </div>
      `;
      const root = parse(html);
      const imgElement = root.querySelector("img") as HTMLElement;
      
      expect(isWithinThumbnails(imgElement)).toBe(false);
    });

    test("handles deeply nested structure", () => {
      const html = `
        <div class="wrapper">
          <div id="thumbnails">
            <div class="thumb-container">
              <div class="thumb-item">
                <img src="image1.png" alt="test">
              </div>
            </div>
          </div>
        </div>
      `;
      const root = parse(html);
      const imgElement = root.querySelector("img") as HTMLElement;
      
      expect(isWithinThumbnails(imgElement)).toBe(true);
    });
  });
});