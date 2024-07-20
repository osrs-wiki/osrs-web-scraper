# osrs-web-scraper

Scrape information from the Oldschool Runescape website and convert it to MediaWiki format.

## Setup

### Install dependencies

```
yarn install
```

### Usage

```
Usage: OSRS Web Scraper [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  news <string>   Scrape an OSRS news posts.
  poll <string>   Scrape an OSRS poll.
  worlds          Scrape the OSRS world list.
  help [command]  display help for command
```

## Releasing

### Create a changeset

Create a changeset file by running the following command:

```
yarn changeset
```

Upon merging a PR, a changeset "Release" PR will be created which consumes all changeset files to build a change log. Merging this "Release" PR will create a new Github Release.
