export const NEWS_RSS_LINK =
  "https://secure.runescape.com/m=news/a=1/latest_news.rss?oldschool=true";

export type NewsCategory =
  | "bts"
  | "community"
  | "competitions"
  | "devblog"
  | "event"
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
  "Event updates": "event",
  "Event update": "event",
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
  "Your Feedback updates": "yourfeedback",
  "Your Feedback": "yourfeedback",
};

export const getNewsCategory = (rawCategory: string) =>
  updateCategories[rawCategory] ?? "game";

export const getNewsUrlIdentifier = (url: string) => {
  const linkSections = url.split("/");
  return linkSections[linkSections.length - 1];
};
