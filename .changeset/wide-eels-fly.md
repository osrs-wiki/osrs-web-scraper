---
"osrs-web-scraper": patch
---

Fix news image widths not respecting `data-width` or inline `style="width: ..."` attributes (causing them to default to 600px), add support for `data-link-href`/`data-caption-href` as image link sources, and fix duplicated/truncated image captions where the file's caption (from a truncated `data-caption-text` attribute) was not being replaced by the full caption from a following `image-caption` div
