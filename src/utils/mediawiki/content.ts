abstract class MediaWikiContent {
  children?: MediaWikiContent | MediaWikiContent[];

  constructor(children?: MediaWikiContent | MediaWikiContent[]) {
    this.children = children;
  }

  abstract build(): string;

  buildChildren(): string {
    if (this.children && Array.isArray(this.children)) {
      return (
        this.children?.reduce(
          (value, content) => (content ? value + "" + content.build() : value),
          ""
        ) ?? ""
      );
    } else if (this.children && this.children instanceof MediaWikiContent) {
      return this.children.build();
    }
    return "";
  }
}

export default MediaWikiContent;
