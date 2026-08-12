---
"osrs-web-scraper": patch
---

Fix galleries not parsing correctly when using the new `osrs-carousel` markup, causing them to render as a flat list of `[[File:...]]` images instead of a `<gallery>` block; also fix gallery entries not referencing the actual downloaded filename when its extension was corrected based on MIME type
