import MediaWikiContent from "./content";

class MediaWikiBuilder {
  content: MediaWikiContent[];

  constructor() {
    this.content = [];
  }

  build() {
    const final =
      this.content?.reduce(
        (value, content) => (content ? value + "" + content.build() : value),
        ""
      ) ?? "";
    return final;
  }

  addContent(content: MediaWikiContent) {
    if (content !== null) {
      this.content.push(content);
    }
  }

  addContents(contents: MediaWikiContent[]) {
    this.content = this.content.concat(contents);
  }
}

export default MediaWikiBuilder;
