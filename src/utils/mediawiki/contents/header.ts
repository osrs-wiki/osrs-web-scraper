import MediaWikiContent from "../content";

class MediaWikiHeader extends MediaWikiContent {
  value: string;
  level: number;

  constructor(value: string, level: number) {
    super();
    this.value = value;
    this.level = level;
  }

  build() {
    return `${"=".repeat(this.level)}${this.value.trim()}${"=".repeat(
      this.level
    )}`;
  }
}

export default MediaWikiHeader;
