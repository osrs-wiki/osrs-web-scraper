import MediaWikiContent from "../content";

type MediaWikiListItemOptions = {
  level: number;
  ordered?: boolean;
};

class MediaWikiListItem extends MediaWikiContent {
  value: MediaWikiContent[] | MediaWikiContent | string;
  options: MediaWikiListItemOptions;

  constructor(
    value: MediaWikiContent[] | MediaWikiContent | string,
    options: MediaWikiListItemOptions
  ) {
    super();
    this.value = value;
    this.options = options;
  }

  build() {
    const parsedValue = Array.isArray(this.value)
      ? this.value.reduce(
          (value, content) => (content ? value + "" + content.build() : value),
          ""
        )
      : this.value instanceof MediaWikiContent
      ? this.value.build()
      : this.value;
    return `\n${(this.options.ordered ? "#" : "*").repeat(
      this.options.level
    )} ${parsedValue.trim()}`;
  }
}

export default MediaWikiListItem;
