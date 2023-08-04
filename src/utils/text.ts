/**
 * Format text content for parsing.
 * @param text
 * @returns
 */
export const formatText = (text: string) =>
  text.trim().replaceAll("&amp;", "&").replaceAll("\t", "");
