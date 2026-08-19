---
"osrs-web-scraper": patch
---

Fix `<video>` news posts: support videos with `src` set directly on the `<video>` tag, download the video asset during scraping, and correctly attach a following caption instead of dropping it. Also ignore non-content `osrsTabNavigation` divs and top-level `link`/`button` tags (e.g. stylesheet links, back-to-top buttons) so they no longer render as "Unsupported tag" comments, and add a break after center-wrapped YouTube embeds so following content isn't glued to the closing `</center>` tag.
