---
"osrs-web-scraper": patch
---

Fix news post images not being centered when the source page no longer wraps them in a `<center>` tag, by detecting the `asset-auto-sized` image class and `asset-link` anchor wrapper that Jagex now uses for standalone, auto-sized images.
