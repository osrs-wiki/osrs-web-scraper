---
"osrs-web-scraper": patch
---

Fix bold quote transformer to correctly reposition quotes that are asymmetric or live only on one side of a bold tag (e.g. `<b>'content</b>'` or `<b>content'</b>`)
