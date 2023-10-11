import MediaWikiContent from "../content";

class MediaWikiHeader extends MediaWikiContent {
  value: string;
  level: number;

  constructor(
    value: string | MediaWikiContent | MediaWikiContent[],
    level: number
  ) {
    super(
      Array.isArray(value) || value instanceof MediaWikiContent
        ? value
        : undefined
    );
    this.value = typeof value === "string" ? (value as string) : undefined;
    this.level = level;
  }

  build() {
    let parsedValue;
    if (this.children) {
      parsedValue = this.buildChildren();
    } else if (this.value) {
      parsedValue = this.value.trim();
    }
    return `${"=".repeat(this.level)}${parsedValue}${"=".repeat(this.level)}`;
  }
}

export default MediaWikiHeader;
