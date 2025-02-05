import Parser from "rss-parser";

const NEWS_RSS_FEED =
  "https://secure.runescape.com/m=news/latest_news.rss?oldschool=true";

export const getLatestNewsTitle = async () => {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(NEWS_RSS_FEED);
    return feed.items.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )?.[0].link;
  } catch (error) {
    console.error(error);
  }
};
