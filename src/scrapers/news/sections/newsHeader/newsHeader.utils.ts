import Parser from "rss-parser";

export const NEWS_RSS_LINK =
  "https://secure.runescape.com/m=news/a=1/latest_news.rss?oldschool=true";

export type NewsCategory =
  | "bts"
  | "community"
  | "competitions"
  | "devblog"
  | "events"
  | "game"
  | "future"
  | "forum"
  | "mobile"
  | "shop"
  | "support"
  | "support"
  | "technical"
  | "website"
  | "yourfeedback";

const updateCategories: { [key: string]: NewsCategory } = {
  "Behind the Scenes updates": "bts",
  "Behind the Scenes": "bts",
  "Community updates": "community",
  "Community": "community",
  "Competition updates": "competitions",
  "Competitions": "competitions",
  "Developer Blogs": "devblog",
  "Developer Blog": "devblog",
  "Dev Blog": "devblog",
  "Dev Blogs": "devblog",
  "Event updates": "events",
  "Event update": "events",
  "Events": "events",
  "Game updates": "game",
  "Game update": "game",
  "Future Updates": "future",
  "Future update": "future",
  "Forum post updates": "forum",
  "Forum post": "forum",
  "Mobile updates": "mobile",
  "Mobile update": "mobile",
  "Shop updates": "shop",
  "Shop update": "shop",
  "Support updates": "support",
  "Support": "support",
  "Technical updates": "technical",
  "Technical": "technical",
  "Website updates": "website",
  "Website update": "website",
  "Website": "website",
  "Your Feedback updates": "yourfeedback",
  "Your Feedback": "yourfeedback",
};

export const getLatestRSSCateogry = async (url: string) => {
  try {
    const rss = await new Parser().parseURL(NEWS_RSS_LINK);
    const urlIdentifier = getNewsUrlIdentifier(url);
    const item = rss?.items?.find(
      (item) => getNewsUrlIdentifier(item?.link) === urlIdentifier
    );
    return item?.categories?.[0];
  } catch (error) {
    return undefined;
  }
};

export const getNewsCategory = (rawCategory: string) => {
  const formattedRawCategory = rawCategory.toLocaleLowerCase().trim();
  const categoryKey =
    Object.keys(updateCategories).find(
      (category) => category.toLocaleLowerCase() === formattedRawCategory
    ) ?? "Game update";
  return updateCategories[categoryKey];
};

export const getNewsUrlIdentifier = (url: string) => {
  const linkSections = url.split("/");
  return linkSections[linkSections.length - 1];
};
