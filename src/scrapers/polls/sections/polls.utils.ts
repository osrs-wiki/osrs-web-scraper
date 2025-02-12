import { parse } from "date-fns";

export const POLL_END_DATE_FORMATS = [
  "EEEE, MMMM do",
  "EEEE MMMM do",
  "EEEE do MMMM",
  "EEEE, do MMMM",
];
const POLL_END_DATE_REGEX = /This poll (will close on|closes on|closes) (.*)\./;

/**
 * Retrieve the end date of the poll from it's header description.
 * @param description The poll header description.
 */
export const getPollEndDate = (description: string) => {
  const endDate = description.match(POLL_END_DATE_REGEX)?.[2];
  let endDateFormatted;
  let endDateFormatIndex = 0;
  while (
    (!endDateFormatted || isNaN(endDateFormatted.getTime())) &&
    endDateFormatIndex < POLL_END_DATE_FORMATS.length
  ) {
    endDateFormatted = parse(
      endDate,
      POLL_END_DATE_FORMATS[endDateFormatIndex++],
      new Date()
    );
  }
  return endDateFormatted;
};

/**
 * Get the amount of votes for a poll question
 * @param voteValue
 * @returns
 */
export const getPollQuestionVote = (voteValue: string) =>
  voteValue === "Results Hidden"
    ? "1"
    : voteValue.replaceAll(/([\d\.\d\%]* \()+/g, "").replaceAll(" votes)", "");
