import MediaWikiContent from "../content";

class MediaWikiHTML extends MediaWikiContent {
  children: string;
  tag: string;

  constructor(tag: string, children: string) {
    super();
    this.tag = tag;
    this.children = children;
  }

  build() {
    return `<${this.tag}>${this.children}</${this.tag}>`;
  }
}

export default MediaWikiHTML;
