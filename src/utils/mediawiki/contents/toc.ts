import MediaWikiContent from "../content";

class MediaWikiTOC extends MediaWikiContent {
  constructor() {
    super();
  }

  build() {
    return "__TOC__";
  }
}

export default MediaWikiTOC;
