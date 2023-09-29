import { getPollQuestionVote } from "../polls.utils";

describe("pollQuestions", () => {
  test("getPollQuestionVote - hidden", () => {
    expect(getPollQuestionVote("Results Hidden")).toBe("1");
  });
  test("getPollQuestionVote - not hidden", () => {
    expect(getPollQuestionVote("80.7% (56454 votes)")).toBe("56454");
  });
});
