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

  test("Time with full date data-utc-original should always show UTC", () => {
    const root = parse(
      `<time class="utc-datetime local-time local-time-toggle" data-timezone-toggle="true" data-utc-original="30 August 2026 | 21:00 UTC" data-local-time="datetime" datetime="2026-08-30T21:00:00.000Z" data-utc-time-ready="true" data-showing-utc="false">
					<span class="local-date">Sunday, August 30th</span>
					<span class="local-clock">at 05:00 PM<button type="button" class="timezone-toggle" title="Click to switch to UTC">LOCAL</button></span>
				</time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with full date data-utc-original should compute correct weekday and ordinal suffix", () => {
    const root = parse(
      `<time data-utc-original="1 September 2026 | 07:00 UTC" datetime="2026-09-01T07:00:00.000Z"></time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with invalid full date data-utc-original falls back to raw text", () => {
    const root = parse(
      `<time data-utc-original="30 Augustus 2026 | 21:00 UTC">30 August 2026, 9:00 PM UTC</time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("Time with a data-end-time should format as a time range", () => {
    const root = parse(
      `<time class="utc-datetime local-time local-time-range local-time-toggle" data-timezone-toggle="true" data-inline="true" data-end-time="19:30 UTC" data-utc-original="5 September 2026 | 14:00 UTC" data-local-time="datetime" datetime="2026-09-05T14:00:00.000Z" data-utc-range-end="2026-09-05T19:30:00.000Z" data-utc-time-ready="true" data-showing-utc="false"><span class="local-range-text"><span class="local-range-date">Saturday, September 5th</span><span class="local-range-divider"> | </span><span class="local-range-clock">10:00 AM - 03:30 PM</span><button type="button" class="timezone-toggle" title="Click to switch to UTC">LOCAL</button></span></time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());
    const result = builder.build();

    expect(result).toBe("Saturday, September 5th | 02:00 PM - 07:30 PM UTC");
    expect(result).toMatchSnapshot();
  });

  test("Time with an invalid data-end-time falls back to the single time format", () => {
    const root = parse(
      `<time data-end-time="25:30 UTC" data-utc-original="5 September 2026 | 14:00 UTC" datetime="2026-09-05T14:00:00.000Z"></time>`
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([timeParser(root.firstChild)].flat());

    expect(builder.build()).toBe("Saturday, September 5th at 2:00 PM UTC");
  });
});
