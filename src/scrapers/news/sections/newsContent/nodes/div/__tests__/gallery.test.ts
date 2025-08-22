import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import { ContentContext } from "../../../newsContent";
import galleryParser from "../gallery";

// Mock file system operations
jest.mock("fs");

describe("gallery node", () => {
  test("Gallery should parse and render", () => {
    const existsSyncSpy = jest
      .spyOn(fs, "existsSync")
      .mockImplementationOnce(() => false);
    const mkdirSyncSpy = jest
      .spyOn(fs, "mkdirSync")
      .mockImplementationOnce(() => "");

    const root = parse(`
      <div class="row">
        <img src="https://example.com/image1.png" />
        <img src="https://example.com/image2.jpg" />
      </div>
    `);

    const builder = new MediaWikiBuilder();
    builder.addContents([galleryParser(root, { title: "test-title" })].flat());
    expect(builder.build()).toMatchSnapshot();

    expect(existsSyncSpy).toHaveBeenCalledWith(`./out/news/test-title`);
    expect(mkdirSyncSpy).toHaveBeenCalledWith(`./out/news/test-title`, {
      recursive: true,
    });
  });

  test("Image slider should parse figure background images and render gallery", () => {
    // Reset image counter for consistent test results
    ContentContext.imageCount = 0;
    
    const existsSyncSpy = jest
      .spyOn(fs, "existsSync")
      .mockImplementation(() => false);
    const mkdirSyncSpy = jest
      .spyOn(fs, "mkdirSync")
      .mockImplementation(() => "");

    const root = parse(`
      <div id="slideshow-container">
        <div class="mySlides" style="display: block;">
          <div class="comparison" data-hd="1SD.png" data-sd="1HD.png">
            <figure style="background-image: url(&quot;https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/1SD.png&quot;);">
              <div class="divisor" style="background-image: url(&quot;https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/1HD.png&quot;);"></div>
            </figure>
            <input type="range" min="0" max="100" value="50">
          </div>
        </div>
        <div class="mySlides" style="display: none;">
          <div class="comparison" data-hd="2SD.png" data-sd="2HD.png">
            <figure style="background-image: url(&quot;https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/2SD.png&quot;);">
              <div class="divisor" style="background-image: url(&quot;https://cdn.runescape.com/assets/img/external/oldschool/2025/newsposts/2025-08-18/2HD.png&quot;);"></div>
            </figure>
            <input type="range" min="0" max="100" value="50">
          </div>
        </div>
      </div>
    `);

    const slideshowDiv = root.querySelector('#slideshow-container');
    const builder = new MediaWikiBuilder();
    builder.addContents([galleryParser(slideshowDiv, { title: "HD & Plugin API Progress Update" })].flat());
    const result = builder.build();
    
    // Should create a gallery with background images from figure and divisor elements
    expect(result).toContain('<gallery');
    expect(result).toContain('HD & Plugin API Progress Update (1).png');
    expect(result).toContain('HD & Plugin API Progress Update (2).png'); 
    expect(result).toContain('HD & Plugin API Progress Update (3).png');
    expect(result).toContain('HD & Plugin API Progress Update (4).png');
    expect(result).toMatchSnapshot();

    expect(existsSyncSpy).toHaveBeenCalled();
    expect(mkdirSyncSpy).toHaveBeenCalled();
  });
});
