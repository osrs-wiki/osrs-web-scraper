---
"osrs-web-scraper": patch
---

Decode decorative `&nbsp;` entities so stray whitespace-only text nodes (e.g. before a video) no longer leak into the output as literal text.
