import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import timeParser from "../time";

describe("time node", () => {
  test("Time with data-utc-original should format as 12h UTC", () => {
    const root = parse(
      `<time class="utc-time local-time local-time-toggle" data-timezone-toggle="true" data-utc-original="15:00 UTC" data-local-time="time" datetime="2026-07-22T15:00:00.000Z" data-utc-time-ready="true" data-showing-utc="true"><span class="local-clock">03:00 PM<button type="button" class="timezone-toggle" title="Click to switch to local time">UTC</button></span></time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with midnight UTC should format correctly", () => {
    const root = parse(
      `<time data-utc-original="00:00 UTC" datetime="2026-07-22T00:00:00.000Z">12:00 AM UTC</time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with noon UTC should format correctly", () => {
    const root = parse(
      `<time data-utc-original="12:00 UTC" datetime="2026-07-22T12:00:00.000Z">12:00 PM UTC</time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with invalid hour falls back to raw text", () => {
    const root = parse(
      `<time data-utc-original="24:00 UTC" datetime="2026-07-22T00:00:00.000Z">12:00 AM UTC</time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with invalid minutes falls back to raw text", () => {
    const root = parse(
      `<time data-utc-original="12:60 UTC" datetime="2026-07-22T12:00:00.000Z">12:00 PM UTC</time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time without data-utc-original falls back to raw text", () => {
    const root = parse(`<time>3:00 PM UTC</time>`);
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
