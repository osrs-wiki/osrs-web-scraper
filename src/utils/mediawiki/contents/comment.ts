import MediaWikiContent from "../content";

class MediaWikiComment extends MediaWikiContent {
  comment: string;

  constructor(comment: string) {
    super();
    this.comment = comment;
  }

  build() {
    return `<!-- ${this.comment} -->`;
  }
}

export default MediaWikiComment;
