import MediaWikiContent from "../content";

class MediaWikiFile extends MediaWikiContent {
  fileName: string;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
  }

  build() {
    return `[[File:${this.fileName}]]`;
  }
}

export default MediaWikiFile;
