import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import pollBoxParser from "../div/pollBox";

describe("pollBox", () => {
  test("poll-box with question returns news poll", () => {
    const root = parse(
      '<div class="poll-box"><p>Question #3</p><p><b>here is the question</b></p></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("poll-box with single node containing number and question", () => {
    const root = parse(
      '<div class="poll-box"><p>Question 1:Here is the example question?</p></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("poll-box with single node containing number and question with proper spacing", () => {
    const root = parse(
      '<div class="poll-box"><p>Question #2: Should this feature be added?</p></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("poll-box demonstrates the original issue is fixed", () => {
    // This test demonstrates that "Question 1:Here is the example question?"
    // now properly extracts number "1" and question "Here is the example question?"
    // instead of concatenating without space
    const root = parse(
      '<div class="poll-box"><p>Question 1:Here is the example question?</p></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    const result = builder.build();
    expect(result).toBe("{{News Poll|1|Here is the example question?}}\n");
    // Verify the question text doesn't include "Question 1:" prefix
    expect(result).not.toContain("Question 1:Here is the example question?");
  });

  test("poll-box with question number and text in same paragraph separated by br tag", () => {
    const root = parse(
      '<div class="poll-box"><p>Question #3:<br><b>Should we add the Login Screen Chapel Cosmetics as tradeable cosmetics into the main game. This would be purchased using points accumulated through the Grid Master event.</b></p></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("poll-box with no poll question returns letter", () => {
    const root = parse(
      '<div class="poll-box"><br/><br/><p><i>header</i></p><p><b>here is the content</b></p><br/><br/></div>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([pollBoxParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });
});
