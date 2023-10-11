import MediaWikiContent from "../content";

class MediaWikiHTML extends MediaWikiContent {
  attributes?: { [key: string]: string };
  tag: string;

  constructor(
    tag: string,
    children: MediaWikiContent[],
    attributes?: { [key: string]: string }
  ) {
    super(children);
    this.tag = tag;
    this.attributes = attributes;
  }

  build() {
    return `<${this.tag}${
      this.attributes
        ? Object.keys(this.attributes).map(
            (key) => ` ${key}=\"${this.attributes[key]}\"`
          )
        : ""
    }>\n${this.buildChildren()}\n</${this.tag}>\n`;
  }
}

export default MediaWikiHTML;
