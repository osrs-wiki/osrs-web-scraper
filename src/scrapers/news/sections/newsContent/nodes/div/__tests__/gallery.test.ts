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

  test("Carousel gallery (osrs-carousel) should parse img slides and render gallery", () => {
    ContentContext.imageCount = 0;

    const existsSyncSpy = jest
      .spyOn(fs, "existsSync")
      .mockImplementation(() => false);
    const mkdirSyncSpy = jest
      .spyOn(fs, "mkdirSync")
      .mockImplementation(() => "");

    const root = parse(`
      <div class="osrs-carousel" data-carousel="">
        <div class="osrs-carousel__thumbs" data-carousel-thumbs=""></div>
        <div class="osrs-carousel__slide">
          <img src="https://example.com/legendartsdrakan.jpg">
          <div class="osrs-carousel__caption"><a href="https://x.com/Legend_Arts">Legend Arts</a> has captured the true majesty of <i>Lord Drakan</i>!</div>
        </div>
        <div class="osrs-carousel__slide">
          <img src="https://example.com/missythebaker1.jpg" data-caption-full="MissyTheBaker cooked up this stunning Ironman trio.">
        </div>
        <div class="osrs-carousel__slide">
          <img src="https://example.com/drunkenmonk.png">
        </div>
        <div class="osrs-carousel__slide osrs-carousel__video"
          data-video="https://example.com/video.mp4"
          data-thumbnail="https://example.com/video-thumbnail.png">
          <div class="osrs-carousel__caption">Video slide with no img tag</div>
        </div>
        <div class="image-caption" data-carousel-caption></div>
      </div>
    `);

    const carouselDiv = root.querySelector(".osrs-carousel");
    const builder = new MediaWikiBuilder();
    builder.addContents(
      [galleryParser(carouselDiv, { title: "test-title" })].flat()
    );
    const result = builder.build();

    expect(result).toContain("<gallery");
    // Caption from an .osrs-carousel__caption element (converted to wikitext, preserving the link and italics)
    expect(result).toContain(
      "test-title (1).jpg|[https://x.com/Legend_Arts Legend Arts] has captured the true majesty of ''Lord Drakan''!"
    );
    // Caption falls back to the img's data-caption-full attribute when there's no caption element
    expect(result).toContain(
      "test-title (2).jpg|MissyTheBaker cooked up this stunning Ironman trio."
    );
    // No caption at all should just render the filename
    expect(result).toContain("test-title (3).png");
    expect(result).not.toMatch(/test-title \(3\)\.png\|/);
    // The video slide has no <img> tag, so only the three image slides should be counted
    expect(ContentContext.imageCount).toBe(3);
    expect(result).toMatchSnapshot();

    expect(existsSyncSpy).toHaveBeenCalledWith("./out/news/test-title");
    expect(mkdirSyncSpy).toHaveBeenCalledWith("./out/news/test-title", {
      recursive: true,
    });
  });

  test("Gallery should reference the actual downloaded filename when the extension was corrected", () => {
    ContentContext.imageCount = 0;

    jest.spyOn(fs, "existsSync").mockImplementation(() => true);
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => "");
    // Simulate a file downloaded as .jpeg that was corrected to .jpg based on MIME type
    jest
      .spyOn(fs, "readdirSync")
      .mockImplementation(() => ["test-title (1).jpg"] as never);

    const root = parse(`
      <div class="row">
        <img src="https://example.com/image1.jpeg" />
      </div>
    `);

    const builder = new MediaWikiBuilder();
    builder.addContents([galleryParser(root, { title: "test-title" })].flat());
    const result = builder.build();

    expect(result).toContain("test-title (1).jpg");
    expect(result).not.toContain("test-title (1).jpeg");
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

    const slideshowDiv = root.querySelector("#slideshow-container");
    const builder = new MediaWikiBuilder();
    builder.addContents(
      [
        galleryParser(slideshowDiv, {
          title: "HD & Plugin API Progress Update",
        }),
      ].flat()
    );
    const result = builder.build();

    // Should create a gallery with background images from figure and divisor elements
    expect(result).toContain("<gallery");
    expect(result).toContain("HD & Plugin API Progress Update (1).png");
    expect(result).toContain("HD & Plugin API Progress Update (2).png");
    expect(result).toContain("HD & Plugin API Progress Update (3).png");
    expect(result).toContain("HD & Plugin API Progress Update (4).png");
    expect(result).toMatchSnapshot();

    expect(existsSyncSpy).toHaveBeenCalled();
    expect(mkdirSyncSpy).toHaveBeenCalled();
  });
});
