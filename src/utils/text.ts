/**
 * Format text content for parsing.
 * @param text
 * @returns
 */
export const formatText = (text: string) =>
  text
    .replaceAll("&amp;", "&")
    .replaceAll("\t", "")
    .replaceAll("\n", "")
    .replaceAll("\r", "");
