---
"osrs-web-scraper": patch
---

Fix TypeError: Cannot read properties of undefined (reading 'children') in MediaWiki startsWith function. Added null/undefined check before accessing children property when processing MediaWiki content arrays containing undefined elements.