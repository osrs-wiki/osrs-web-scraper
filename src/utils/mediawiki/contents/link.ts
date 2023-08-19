import MediaWikiContent from "../content";

class MediaWikiLink extends MediaWikiContent {
  label?: string;
  link: string;

  constructor(link: string, label?: string) {
    super();
    this.label = label;
    this.link = link;
  }

  build() {
    return `[[${this.link}${this.label ? `|${this.label}` : ""}]]`;
  }
}

export default MediaWikiLink;
