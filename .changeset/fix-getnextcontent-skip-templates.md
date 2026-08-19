---
"osrs-web-scraper": patch
---

Fix `getNextContent` skipping over non-text content (e.g. `{{clear}}`/`__TOC__` after a header image), which was causing them to be dropped and the header image to incorrectly merge with an unrelated later paragraph as its caption.
