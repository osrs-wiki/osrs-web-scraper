---
"osrs-web-scraper": patch
---

Fix a news scraping crash by preserving parser context/options in `poll-box` nested node parsing so nested images still receive the page title during filename formatting.
