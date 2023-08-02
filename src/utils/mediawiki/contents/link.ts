import MediaWikiContent from "../content";

class MediaWikiLink extends MediaWikiContent {
  label: string;
  link: string;

  constructor(label: string, link: string) {
    super();
    this.label = label;
    this.link = link;
  }

  build() {
    return `[[${this.link}${this.label ? `|${this.label}` : ""}]]`;
  }
}

export default MediaWikiLink;
