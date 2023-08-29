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
    if (content !== null && content !== undefined) {
      this.content.push(content);
    }
    return this;
  }

  addContents(contents: MediaWikiContent[]): MediaWikiBuilder {
    this.content = this.content.concat(
      contents.filter((content) => content !== undefined && content !== null)
    );
    return this;
  }

  addTransformer(transformer: MediaWikiTransformer): MediaWikiBuilder {
    this.transformers.push(transformer);
    return this;
  }
}

export default MediaWikiBuilder;
