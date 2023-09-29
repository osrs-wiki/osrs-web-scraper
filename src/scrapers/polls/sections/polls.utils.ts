/**
 *
 * @param voteValue
 * @returns
 */
export const getPollQuestionVote = (voteValue: string) =>
  voteValue === "Results Hidden"
    ? "1"
    : voteValue.replaceAll(/([\d\.\d\%]* \()+/g, "").replaceAll(" votes)", "");
