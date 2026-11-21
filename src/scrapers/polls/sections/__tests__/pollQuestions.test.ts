import { parse } from "node-html-parser";

import pollQuestions from "../pollQuestions";

const pollView = `
  <div data-testid="PollView">
    <div id="poll-questions">
      <div>
        <h2>First question?</h2>
        <fieldset>
          <li><span>Yes</span><div>90% (90)</div></li>
          <li><span>No</span><div>10% (10)</div></li>
        </fieldset>
      </div>
    </div>
    <div><p>Explanation before the next question.</p></div>
    <div>
      <div>
        <h2>Second question?</h2>
        <fieldset>
          <li><span>Yes</span><div>75% (75)</div></li>
          <li><span>No</span><div>25% (25)</div></li>
        </fieldset>
      </div>
    </div>
    <div>
      <p>Thanks for taking the time to vote.</p>
      <p>Share any further thoughts through the usual channels.</p>
    </div>
  </div>
`;

describe("pollQuestions", () => {
  it("preserves descriptive blocks between choice questions", async () => {
    const root = parse(pollView);
    const element = root.querySelector('[data-testid="PollView"]');
    if (!element) {
      throw new Error("Missing test poll view");
    }

    const output = (await pollQuestions.format(element, "")).map((content) =>
      content.build()
    );

    expect(output.join("")).toContain(
      "{{Poll\n|Question = First question?\n|Answer1 = Yes\n|Votes1 = 90\n|Answer2 = No\n|Votes2 = 10\n}}\n"
    );
    expect(output[1].trim()).toBe(
      "{{PollDescription|Explanation before the next question.}}"
    );
    expect(output[2]).toContain("|Question = Second question?");
    expect(output.join("")).not.toContain("Thanks for taking the time");
    expect(output.join("")).not.toContain("Share any further thoughts");
  });

  it.each(["RankedQuestion", "MatrixQuestion", "TextQuestion"])(
    "rejects unsupported %s results",
    async (testId) => {
      const root = parse(`
        <div data-testid="PollView">
          <div id="poll-questions"></div>
          <div data-testid="${testId}"></div>
        </div>
      `);
      const element = root.querySelector('[data-testid="PollView"]');
      if (!element) {
        throw new Error("Missing test poll view");
      }

      await expect(pollQuestions.format(element, "")).rejects.toThrow(
        `Unsupported poll question layout: ${testId}`
      );
    }
  );
});
