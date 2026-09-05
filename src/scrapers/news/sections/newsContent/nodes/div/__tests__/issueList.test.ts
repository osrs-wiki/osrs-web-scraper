import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import issueListParser from "../issueList";

describe("issueList", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("issue-list with multiple issues returns a wikitable", () => {
    const root = parse(`
      <div class="issue-list">
        <div class="issue issue--half is-expandable is-open" data-issue-ready="true">
          <button class="issue-button" type="button" aria-expanded="true">
            <div class="issue-summary">
              <span class="issue-title">Chatbox Issues</span>
              <span class="issue-status" style="background:#b86600">Investigating</span>
              <span class="issue-meta"><span class="issue-meta-left">
                <span class="issue-time-toggle" data-local="Thursday, September 3rd at 09:30 AM" data-utc="Thursday, September 3rd at 01:30 PM" data-showing-utc="true">
                  <span class="issue-time-value">Thursday, September 3rd at 01:30 PM</span>
                  <span class="issue-timezone-badge">UTC</span>
                </span>
              </span><span class="issue-meta-updated issue-updated-time" data-local="06:20 AM" data-utc="10:20 AM">Updated 10:20 AM</span></span>
            </div>
          </button>
          <div class="issue-details"><div class="issue-description">We're aware that some players <a href="https://discord.com/channels/324132423636090880/1545013889521946675" target="_blank" rel="noopener noreferrer">cannot scroll the chatbox</a> with their finger.
            <br><br>
            We've also seen reports of the <a href="https://discord.com/channels/324132423636090880/960550250530086993/1545014636514902106" target="_blank" rel="noopener noreferrer">channel buttons</a> not responding when being pressed.</div></div>
        </div>

        <div class="issue issue--half is-expandable" data-issue-ready="true">
          <button class="issue-button" type="button" aria-expanded="false">
            <div class="issue-summary">
              <span class="issue-title">Total Level Box</span>
              <span class="issue-status" style="background:#8b3a62">Issue Raised</span>
              <span class="issue-meta"><span class="issue-meta-left">
                <span class="issue-time-toggle" data-local="Thursday, September 3rd at 06:25 AM" data-utc="Thursday, September 3rd at 10:25 AM" data-showing-utc="true">
                  <span class="issue-time-value">Thursday, September 3rd at 10:25 AM</span>
                  <span class="issue-timezone-badge">UTC</span>
                </span>
              </span><span class="issue-meta-updated issue-updated-time" data-local="06:25 AM" data-utc="10:25 AM">Updated 10:25 AM</span></span>
            </div>
          </button>
          <div class="issue-details"><div class="issue-description">Some players have raised that the <a href="https://discord.com/channels/324132423636090880/960550250530086993/1545015850900127796" target="_blank" rel="noopener noreferrer">Total Level text</a> now appears in the top-left of the screen rather than over the appropriate skill.</div></div>
        </div>
      </div>
    `);
    const builder = new MediaWikiBuilder();
    builder.addContents(
      [issueListParser(root.querySelector(".issue-list"))].flat()
    );
    expect(builder.build()).toMatchSnapshot();
  });

  test("issue-list with no issues returns undefined", () => {
    const root = parse('<div class="issue-list"></div>');
    expect(issueListParser(root.querySelector(".issue-list"))).toBeUndefined();
  });

  test("issue title containing a literal pipe is escaped for table syntax", () => {
    const root = parse(`
      <div class="issue-list">
        <div class="issue">
          <button class="issue-button" type="button">
            <div class="issue-summary">
              <span class="issue-title">TABLET | Special Attack Button Requires A Long Press</span>
              <span class="issue-status" style="background:#b86600">Investigating</span>
              <span class="issue-meta"><span class="issue-meta-left">
                <span class="issue-time-toggle" data-local="Thursday, September 3rd at 06:55 AM" data-utc="Thursday, September 3rd at 10:55 AM">
                  <span class="issue-time-value">Thursday, September 3rd at 10:55 AM</span>
                </span>
              </span><span class="issue-meta-updated issue-updated-time" data-local="07:20 AM" data-utc="11:20 AM">Updated 11:20 AM</span></span>
            </div>
          </button>
          <div class="issue-details"><div class="issue-description">A player has raised that the Special Attack Orb now requires a long press.</div></div>
        </div>
      </div>
    `);
    const builder = new MediaWikiBuilder();
    builder.addContents(
      [issueListParser(root.querySelector(".issue-list"))].flat()
    );
    expect(builder.build()).toMatchSnapshot();
  });

  test("non issue-list div returns undefined", () => {
    const root = parse('<div class="some-other-class"></div>');
    expect(issueListParser(root.firstChild)).toBeUndefined();
  });
});
