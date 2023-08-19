import MediaWikiContent from "./content";
import MediaWikiTransformer from "./transformer";

class MediaWikiBuilder {
  content: MediaWikiContent[];
  transformers: MediaWikiTransformer[];

  constructor() {
    this.content = [];
    this.transformers = [];
  }

  build() {
    this.transformers.forEach((transformer) => {
      this.content = transformer.transform(this.content);
    });
    const final =
      this.content?.reduce(
        (value, content) => (content ? value + "" + content.build() : value),
        ""
      ) ?? "";
    return final;
  }

  addContent(content: MediaWikiContent): MediaWikiBuilder {
    if (content !== null) {
      this.content.push(content);
    }
    return this;
  }

  addContents(contents: MediaWikiContent[]): MediaWikiBuilder {
    this.content = this.content.concat(contents);
    return this;
  }

  addTransformer(transformer: MediaWikiTransformer): MediaWikiBuilder {
    this.transformers.push(transformer);
    return this;
  }
}

export default MediaWikiBuilder;
