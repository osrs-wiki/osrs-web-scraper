import MediaWikiContent from "../content";

class MediaWikiTOC extends MediaWikiContent {
  constructor() {
    super();
  }

  build() {
    return "__TOC__\n";
  }
}

export default MediaWikiTOC;
