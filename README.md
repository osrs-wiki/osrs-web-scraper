# osrs-web-scraper
Scrape information from the Oldschool Runescape website.

## Setup

### Install dependencies
```
yarn install
```

### Setup environment
```
NODE_ENV=development
NEWS_LINK=https://secure.runescape.com/m=news/a=1/desert-treasure-ii---the-fallen-empire?oldschool=1
```

### Run the scraper
```
yarn start
```

## Releasing

### Create a changeset
Create a changeset file by running the following command:
```
yarn changeset
```

Upon merging a PR, a changeset "Release" PR will be created which consumes all changeset files to build a change log. Merging this "Release" PR will create a new Github Release.
