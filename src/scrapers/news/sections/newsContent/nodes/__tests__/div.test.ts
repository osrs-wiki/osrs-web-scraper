import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import divParser from "../div";

describe("div node", () => {
  test("poll-box class should parse and render", () => {
    const root = parse(
      "<div class='poll-box'><p>Question #X:</p><p><b>If While Guthix Sleeps is added to the game, should we continue to explore the idea of offering the Rites of Balance as a rewards from the quest? This question is for developer consideration and not binding.</b></p></div>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("poll-box2 class should parse and render", () => {
    const root = parse(
      '<div class="poll-box2">Question:<br><b>Should we add a new facility to collect cannonballs used at sea, as explained in the blog?</b></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("thumb-row class should be ignored and not render", () => {
    const root = parse(
      '<div class="thumb-row" id="thumbnails"><img src="image1.png" alt="thumbnail 1"><img src="image2.png" alt="thumbnail 2"></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("slideshow-container id should parse as gallery", () => {
    const root = parse(
      '<div id="slideshow-container"><div class="mySlides"><figure style="background-image: url(&quot;https://example.com/image1.png&quot;);"></figure></div></div>'
    );
    const result = divParser(root.firstChild, { title: "Test Post" });
    expect(result).toBeDefined();
    // The result should be a gallery parser result with the tag "gallery"
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tag: "gallery",
        }),
      ])
    );
  });

  test("osrs-carousel class should parse as gallery", () => {
    const root = parse(
      '<div class="osrs-carousel" data-carousel=""><div class="osrs-carousel__slide"><img src="https://example.com/image1.png"><div class="osrs-carousel__caption">Caption text</div></div></div>'
    );
    const result = divParser(root.firstChild, { title: "Test Post" });
    expect(result).toBeDefined();
    // The result should be a gallery parser result with the tag "gallery"
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tag: "gallery",
        }),
      ])
    );
  });

  test("osrs-title class should parse as level 2 header", () => {
    const root = parse('<div class="osrs-title">Main Title</div>');
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("osrs-subtitle class should parse as level 3 header", () => {
    const root = parse('<div class="osrs-subtitle">Subtitle Text</div>');
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("osrs-title with nested content should parse correctly", () => {
    const root = parse(
      '<div class="osrs-title">Title with <b>bold</b> and <i>italic</i></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("osrs-subheading class should parse as level 4 header", () => {
    const root = parse('<div class="osrs-subheading">Subheading Text</div>');
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("osrs-embed__fallback class should preserve text around link", () => {
    const root = parse(
      '<div class="osrs-embed__fallback">If you can\'t see the embedded content above, <a href="https://www.youtube.com/embed/5PwrxOzH5P4?si=0G50ueNJQugoBmpb">click here</a>.</div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("table-scroll-notice class should be ignored and not render", () => {
    const root = parse(
      '<div class="table-scroll-notice" aria-hidden="true">↔ Scroll horizontally to view all columns</div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    expect(builder.build()).toBe("");
  });

  test("table-scroll wrapper div should unwrap and render its table child", () => {
    const root = parse(
      '<div class="table-scroll" role="region" tabindex="0" aria-label="Scrollable table"><table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td>test</td><td>test</td></tr></tbody></table></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([divParser(root.firstChild)].flat());
    const result = builder.build();

    expect(result).not.toContain("Scroll horizontally");
    expect(result).toContain('{| class="wikitable"');
    expect(result).toMatchSnapshot();
  });
});
