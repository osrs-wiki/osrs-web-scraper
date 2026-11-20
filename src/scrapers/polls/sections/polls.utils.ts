import { format, parse } from "date-fns";

export const POLL_END_DATE_FORMATS = [
  "EEEE, MMMM do",
  "EEEE MMMM do",
  "EEEE do MMMM",
  "EEEE, do MMMM",
];
const POLL_END_DATE_REGEX = /This poll (will close on|closes on|closes) (.*)\./;

export const getPollId = (url: string) => {
  const parsedUrl = new URL(url);
  return (
    parsedUrl.searchParams.get("id") ??
    parsedUrl.pathname.match(/\/polls\/\d{4}\/(\d+)\/?$/)?.[1]
  );
};

export const formatPollNoticeDate = (date: string) => {
  const formats = ["d MMMM yyyy", "dd MMMM yyyy", "yyyy-MM-dd"];
  for (const dateFormat of formats) {
    const parsedDate = parse(date.trim(), dateFormat, new Date());
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, "d MMMM yyyy");
    }
  }
  throw new Error(`Could not format poll date: ${date}`);
};

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
export const getPollQuestionVote = (voteValue: string) => {
  const normalizedVoteValue = voteValue.trim();
  return normalizedVoteValue === "Results Hidden" || !normalizedVoteValue
    ? "1"
    : normalizedVoteValue
        .match(/\(([\d,]+)(?: votes)?\)/)?.[1]
        .replaceAll(",", "") ?? normalizedVoteValue;
};
