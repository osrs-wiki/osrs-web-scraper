---
"osrs-web-scraper": patch
---

Treat `undefined`/`null` content as empty in `isEmpty`, fixing a truly-empty `<p></p>` being mistaken for real content when locating a following caption.
