import {
  formatPollNoticeDate,
  getPollEndDate,
  getPollId,
  getPollQuestionVote,
} from "../polls.utils";

describe("polls.utils", () => {
  describe("getPollId", () => {
    it.each([
      ["https://oldschool.runescape.com/polls/2025/1708", "1708"],
      ["https://oldschool.runescape.com/polls/2025/1708/", "1708"],
      [
        "https://oldschool.runescape.com/polls/2025/1708?utm_source=test",
        "1708",
      ],
      [
        "https://oldschool.runescape.com/polls/2025/1708#poll-questions",
        "1708",
      ],
      [
        "https://secure.runescape.com/m=poll/a=13/oldschool/results?id=1708",
        "1708",
      ],
    ])("should extract a poll id from %s", (url, expected) => {
      expect(getPollId(url)).toBe(expected);
    });
  });

  describe("formatPollNoticeDate", () => {
    it.each(["08 August 2025", "8 August 2025", "2025-08-08"])(
      "should format %s without converting time zones",
      (date) => {
        expect(formatPollNoticeDate(date)).toBe("8 August 2025");
      }
    );
  });

  describe("getPollQuestionVote", () => {
    test("getPollQuestionVote - hidden", () => {
      expect(getPollQuestionVote("Results Hidden")).toBe("1");
    });
    test("getPollQuestionVote - hidden with whitespace", () => {
      expect(getPollQuestionVote("  Results Hidden  ")).toBe("1");
    });
    test("getPollQuestionVote - not hidden", () => {
      expect(getPollQuestionVote("80.7% (56454 votes)")).toBe("56454");
    });
    test("getPollQuestionVote - formatted new layout", () => {
      expect(getPollQuestionVote("23.2% (23,851)")).toBe("23851");
    });
    test("getPollQuestionVote - skipped new layout", () => {
      expect(getPollQuestionVote(" (10,643)")).toBe("10643");
    });
    test("getPollQuestionVote - missing active result", () => {
      expect(getPollQuestionVote("")).toBe("1");
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
