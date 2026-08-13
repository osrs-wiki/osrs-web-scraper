/**
 * Format text content for parsing.
 * @param text
 * @returns
 */
export const formatText = (text?: string) =>
  text
    ?.replaceAll("&amp;", "&")
    ?.replace(/[\t\r\n]+/g, " ")
    ?.replace(/ {2,}/g, " ");
