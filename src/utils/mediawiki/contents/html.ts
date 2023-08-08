import MediaWikiContent from "../content";

class MediaWikiHTML extends MediaWikiContent {
  attributes?: { [key: string]: string };
  children: MediaWikiContent[];
  tag: string;

  constructor(
    tag: string,
    children: MediaWikiContent[],
    attributes?: { [key: string]: string }
  ) {
    super();
    this.tag = tag;
    this.children = children;
    this.attributes = attributes;
  }

  build() {
    return `<${this.tag}${
      this.attributes
        ? Object.keys(this.attributes).map(
            (key) => `${key}=\"${this.attributes[key]}\"`
          )
        : ""
    }>${this.children.reduce(
      (value, content) => (value += content.build()),
      ""
    )}\n</${this.tag}>`;
  }
}

export default MediaWikiHTML;
