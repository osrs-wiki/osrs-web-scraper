# osrs-web-scraper

## 0.18.1

### Patch Changes

- a727f28: Add "Website" to news category list
- 2679d06: Upgrade puppeteer to 23.2.1
- a727f28: Add case insensitive news category detection

## 0.18.0

### Minor Changes

- 8ae1b18: Replace yarn with npm

### Patch Changes

- 0a4c2b4: Bump word-wrap from 1.2.3 to 1.2.5
- 33eae6c: Bump json5 from 1.0.1 to 1.0.2
- 2a84668: Bump braces from 3.0.2 to 3.0.3

## 0.17.2

### Patch Changes

- 70a6da4: Bump word-wrap from 1.2.3 to 1.2.5
- 830f739: Bump @babel/traverse from 7.18.6 to 7.25.3
- 2af7394: Bump braces from 3.0.2 to 3.0.3
- e3e94b7: Combine elements in NewsFileCaptionTransformer
- cf3278c: Fixes to Github workflow action versions

## 0.17.1

### Patch Changes

- 781407b: Correct the writeFileSync poll folder path

## 0.17.0

### Minor Changes

- bc845dd: Update workflow dispatch to allow choiced tasks
- bc845dd: Add commander for cli parsing
- bc845dd: Add world list scraping

### Patch Changes

- 395253a: Sort output of world scraping
- bc845dd: Update all workflows to use Node 21
- ab396cc: Fix start:node command
- e835205: Fix poll task output directory

## 0.16.4

### Patch Changes

- f524e61: Support multiple end date formats for polls

## 0.16.3

### Patch Changes

- 8b38438: Fix poll end date parsing

## 0.16.2

### Patch Changes

- 67bc3e7: Trim header content
- 643ba20: Add support for parsing image node width

## 0.16.1

### Patch Changes

- 5609968: Replace "|" in file names with "-".
- ea3bbeb: Add try-catch to image size detection

## 0.16.0

### Minor Changes

- 8765240: Rename NewsImageCaptionTransformer to NewsFileCaptionTransformer
- 8765240: Replace Listen template with MediaWikiFile in audio node parsing

## 0.15.0

### Minor Changes

- 67a9341: Add support for the span tag

## 0.14.3

### Patch Changes

- 88b3e00: Add cache option to github actions
- e01c779: Add tests for various node parsers.

## 0.14.2

### Patch Changes

- b9178ea: Re-order table option params
- b9178ea: Add support to table parser for parsing thead

## 0.14.1

### Patch Changes

- 4f7d8b3: Gracefully handle news post category fetching failures
- 55893c5: Update @osrs-wiki/mediawiki-builder
- 24ff306: Add Events to supported update categories
- 62a9d51: Add support for strong parsing as bold formatted text
- 55893c5: Update table node parser to support new mediawiki-builder table format

## 0.14.0

### Minor Changes

- 4b08836: Migrate to @osrs-wiki/mediawiki-builder

### Patch Changes

- 24359a2: Add thumb format to images in image caption transformer
- 91940ce: Fix poll total parsing
- 91940ce: Include poll total if current date is after or equal to poll end date

## 0.13.0

### Minor Changes

- 1bfdc93: Add support for Letter parsing
- 438d9b1: Add support for embedded videos
- 1df9ee9: Add support for parsing different header levels

## 0.12.0

### Minor Changes

- dcc15b4: Add children support to MediaWikiContent
- dcc15b4: Support text parsing in MediaWikiHeader

### Patch Changes

- 030f087: Handle image download failures

## 0.11.3

### Patch Changes

- 1838729: Support image buttons including a link

## 0.11.2

### Patch Changes

- f52e6a2: Fix hidden poll result parsing

## 0.11.1

### Patch Changes

- 295894e: Fix css selector for news post content container

## 0.11.0

### Minor Changes

- c7dee3c: Add support for parsing audio files in news posts

### Patch Changes

- 3356030: Fix sub-bullet list spacing
- 9f05356: Add support for the "Dev Blogs" news post category
- 3356030: Fix spacing around MediaWikiHeader's

## 0.10.0

### Minor Changes

- 6669835: Add support for a NewsPoll template with only a question

## 0.9.0

### Minor Changes

- dbb6ea8: Add rss parsing for supporting the news category in news post

### Patch Changes

- af84478: Fix poll number and end date parsing

## 0.8.0

### Minor Changes

- bde9130: Add support for transforming MediaWikiText into MediaWikiFile captions
- ae249c0: Add transformer for converting single line bold text to header-3
- ae249c0: Add transformer for combining consecutive MediaWikiBreak's

### Patch Changes

- 400c4d3: Fix PollFooter and PollWrapper order

## 0.7.0

### Minor Changes

- 3bcd631: Add support for slideshow-container galleries

### Patch Changes

- 3bcd631: Fix news poll default question number
- 3bcd631: Fix osw links formatting as external links
- 29ff316: Fix a pollbox title bug causing the news scraper to fail

## 0.6.0

### Minor Changes

- fa808be: Add support for content transformers

### Patch Changes

- fa808be: Fix missing seperator in news post footer
- fa808be: Add test for mediawiki link

## 0.5.0

### Minor Changes

- 6964dc0: Add support for tables

## 0.4.0

### Minor Changes

- 58953b0: Add support for poll pages

## 0.3.0

### Minor Changes

- 62fffac: Add support for image galleries

## 0.2.0

### Minor Changes

- fc94e38: Add support for div class parsers and implement in News Poll parser
- fc94e38: Add support for collapsible sections

### Patch Changes

- 1bdf68e: Fix text trimming for in text node parsing
- 1bdf68e: Fix iframe/video parsing
- 1bdf68e: Fix div container parsing
- 1bdf68e: Fix &amp; in image and file names
- fc94e38: Fix bulleted lists spacing

## 0.1.0

### Minor Changes

- 4e89b80: Initial setup
- 4e89b80: Basic mediawiki content tools
- 4e89b80: Basic news post parsers

### Patch Changes

- 30df62a: Close the Puppeteer browser when scraping is complete
- 5a9816c: Fix image extensions when downloading images
- 5a9816c: Add info logging to newspost scraper
- 5a9816c: Download newspost images in parallel
- 0c834a3: Combine workflow dispatch jobs
- 8ad82d5: Fix changeset action
