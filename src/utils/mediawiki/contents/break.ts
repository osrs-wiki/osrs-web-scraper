import MediaWikiContent from "../content";

class MediaWikiBreak extends MediaWikiContent {
  constructor() {
    super();
  }

  build() {
    return "\n";
  }
}

export default MediaWikiBreak;
