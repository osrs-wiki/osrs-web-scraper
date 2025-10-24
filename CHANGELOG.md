# osrs-web-scraper

## 0.26.0

### Minor Changes

- 9f202d8: Add support for parsing HTML header tags (h1-h6) in news posts
- 7d9ad4d: Add MediaWikiBreak to header, paragraph, and list parsers for proper spacing

### Patch Changes

- 07366a1: Fix ordered lists being converted to unordered lists
- 95158e4: Fix YouTube transformer to correctly place captions inside center tags
- da20a33: Add support for parsing table row headers with mixed th and td elements

## 0.25.2

### Patch Changes

- fc28b90: Center YouTube templates and their captions
- 791a34e: Fix table parsing error with multiple tbody elements and orphan li elements
- db6ba13: Bump brace-expansion from 1.1.11 to 1.1.12
- 8dd98da: Fix bold text surrounded by single quotes MediaWiki formatting issues
- 3f35317: Bump tar-fs from 3.0.9 to 3.1.1

## 0.25.1

### Patch Changes

- d2aa555: Filter out undefined content in table and text parsing
- d2aa555: Update worlds e2e test to not use snapshots

## 0.25.0

### Minor Changes

- 391d138: Replace nodemon with tsx for improved TypeScript development experience with faster startup times and better hot reloading.

### Patch Changes

- 391d138: Fix poll question parsing to properly handle spacing between question numbers and text when they are in separate HTML elements.
- 391d138: Improve text parser to return undefined for empty text nodes instead of creating unnecessary empty MediaWikiText elements.

## 0.24.0

### Minor Changes

- f84e169: Add copilot-setup-steps for setting up the Github Copilot agent environment
- 3a0d204: Save images with extensions matching their MIME type
- 86a2e2f: Add comprehensive e2e snapshot tests for CLI commands with GitHub Actions workflows
- 3029967: Add support for image sliders with background image extraction

### Patch Changes

- 24685ba: Restore e2e test snapshots - snapshots should be regenerated with `npm run test:e2e -- -u` when Chrome is available

## 0.23.0

### Minor Changes

- b1b553c: Added `.github/copilot-instructions.md` with detailed instructions for GitHub Copilot agents working in the osrs-web-scraper codebase

### Patch Changes

- 6ca0446: Add support for smalltitle and bigtitle HTML tags in news content parsing.
- 2190844: Fix footer transformer index comparison bug and add undefined element filtering to prevent build errors.
- 35b076d: Fix TypeError: Cannot read properties of undefined (reading 'children') in MediaWiki startsWith function. Added null/undefined check before accessing children property when processing MediaWiki content arrays containing undefined elements.

## 0.22.1

### Patch Changes

- 3e4e8fe: Remove spacing between bulleted points
- 3e4e8fe: Add support for a missing u1 parser
- 3e4e8fe: Remove blank new line from gallery
- 3e4e8fe: Add new line after a table
- 204e805: Update changeset action to version v1.4.10 in push-main workflow

## 0.22.0

### Minor Changes

- dd457ff: Add Youtube playlist support to iframe parser

### Patch Changes

- e0e69c9: Disallow question marks in newspost title directories
- 9d3813e: Bump tar-fs from 3.0.8 to 3.0.9
- e0e69c9: Fix empty contents parsing in mediawiki getFirstStringContent and startsWith

## 0.21.1

### Patch Changes

- f571254: Bump tar-fs from 3.0.6 to 3.0.8
- 7af6db7: Bump @babel/runtime from 7.22.10 to 7.27.0
- 4411ebb: Bump tj-actions/changed-files from 41 to 46 in /.github/workflows
- 06e1e4f: Fix table header parsing
- 7c32de5: Bumps image-size from 1.1.1 to 1.2.1.

## 0.21.0

### Minor Changes

- a6fc424: Update transformers to support new text-children changes
- a6fc424: Update bold, italic, and underline parsers to wrap in MediaWikiText

## 0.20.0

### Minor Changes

- 6d30431: Add scheduled news post scrape for update post
- 6d30431: Refactor command line interface commands
- 6d30431: Add support for fetching latest news post from rss feed

### Patch Changes

- 3ca6241: Add support for additional poll end date format

## 0.19.3

### Patch Changes

- 41330a5: Pass options to children nodes in text parser
- 6205004: Upgrade actions/upload-artifact to v4

## 0.19.2

### Patch Changes

- c50f3aa: Upgrade puppeteer to 23.11.1 and use no-sandbox args

## 0.19.1

### Patch Changes

- 81775d4: Fix poll header scraping to account for new end date sentence format
- 632bf6b: Add support for pulling iframe link from src attribute

## 0.19.0

### Minor Changes

- e89600e: Add support for sup and sub hmtl tags
- cf550c9: Add support for parsing poll-box Letter template
- bcc9215: Add support for Youtube template in iframe parser

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
