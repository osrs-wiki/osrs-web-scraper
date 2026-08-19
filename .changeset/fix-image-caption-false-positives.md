---
"osrs-web-scraper": patch
---

Stop images (not just videos) from incorrectly picking up an unrelated following paragraph as their caption; only italicised captions, fallback-embed captions, or `data-caption-text`/non-empty `image-caption` divs are merged.
