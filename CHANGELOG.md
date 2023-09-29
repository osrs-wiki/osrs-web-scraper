# osrs-web-scraper

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
