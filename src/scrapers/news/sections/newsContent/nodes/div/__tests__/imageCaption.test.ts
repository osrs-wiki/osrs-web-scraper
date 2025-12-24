import { MediaWikiText } from "@osrs-wiki/mediawiki-builder";
import { parse } from "node-html-parser";

import imageCaptionParser from "../imageCaption";

describe("imageCaptionParser", () => {
  test("should parse image caption with plain text", () => {
    const html = '<div class="image-caption">This is a caption.</div>';
    const node = parse(html).firstChild;

    const result = imageCaptionParser(node, {});
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiText);
    expect((content[0] as MediaWikiText).build()).toMatchSnapshot();
  });

  test("should parse image caption with link", () => {
    const html =
      '<div class="image-caption">If you can\'t see the asset above, <a href="https://survey.alchemer.eu/s3/90920540/Jagex-Support-Update?chl=np&amp;game=OSRS" target="_blank">click here</a>.</div>';
    const node = parse(html).firstChild;

    const result = imageCaptionParser(node, {});
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiText);
    expect((content[0] as MediaWikiText).build()).toMatchSnapshot();
  });

  test("should parse image caption with multiple elements", () => {
    const html =
      '<div class="image-caption">Visit <a href="https://example.com">our site</a> or <a href="https://other.com">this one</a> for more info.</div>';
    const node = parse(html).firstChild;

    const result = imageCaptionParser(node, {});
    const content = Array.isArray(result) ? result : [result];

    expect(content[0]).toBeInstanceOf(MediaWikiText);
    expect((content[0] as MediaWikiText).build()).toMatchSnapshot();
  });
});
