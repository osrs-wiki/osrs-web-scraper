import { getPollEndDate, getPollQuestionVote } from "../polls.utils";

describe("polls.utils", () => {
  describe("getPollQuestionVote", () => {
    test("getPollQuestionVote - hidden", () => {
      expect(getPollQuestionVote("Results Hidden")).toBe("1");
    });
    test("getPollQuestionVote - not hidden", () => {
      expect(getPollQuestionVote("80.7% (56454 votes)")).toBe("56454");
    });
  });

  describe("getPollEndDate", () => {
    const expectedDate = new Date(new Date().getFullYear(), 9, 15);
    it("should parse the end date correctly from the description", () => {
      const description = "This poll will close on Friday, October 15th.";
      const endDate = getPollEndDate(description);
      expect(endDate).toEqual(expectedDate);
    });

    it.each([
      "Friday, 15th October",
      "Friday 15th October",
      "Friday October 15th",
      "Friday, October 15th",
    ])("should handle date formats: %p", (format) => {
      const endDate = getPollEndDate(`This poll closes on ${format}.`);
      expect(endDate).toEqual(expectedDate);
    });

    it.each(["closes on", "will close on", "closes"])(
      "should handle different sentence formats: %p",
      (format) => {
        const endDate = getPollEndDate(
          `This poll ${format} Friday October 15th.`
        );
        expect(endDate).toEqual(expectedDate);
      }
    );

    it("should return an invalid date for an incorrect format", () => {
      const description = "This poll closes on an unknown date.";
      const endDate = getPollEndDate(description);
      expect(isNaN(endDate.getTime())).toBe(true);
    });
  });
});
