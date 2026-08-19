---
"osrs-web-scraper": patch
---

Fix `<video>` news posts: support videos with `src` set directly on the `<video>` tag, download the video asset during scraping, and correctly attach a following caption instead of dropping it. Also ignore non-content `osrsTabNavigation` divs and top-level `link`/`button` tags (e.g. stylesheet links, back-to-top buttons) so they no longer render as "Unsupported tag" comments, add a break after center-wrapped YouTube embeds so following content isn't glued to the closing `</center>` tag, decode decorative `&nbsp;` entities so stray whitespace-only text nodes (e.g. before a video) no longer leak into the output, always center images/videos (matching the CSS-based centering the news page now uses instead of `<center>` wrapper tags), and stop videos from incorrectly picking up an unrelated following narrative paragraph as their caption (only images and italicised/fallback captions are merged as captions for videos).
