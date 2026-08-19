---
"osrs-web-scraper": patch
---

Fix a caption failing to merge into its file when the italicised caption text has no nested link (its `children` is a plain string rather than an array).
