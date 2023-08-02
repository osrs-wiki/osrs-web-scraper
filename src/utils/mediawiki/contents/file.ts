import MediaWikiContent from "../content";

type MediaWikiFileOptions = {
  format?: "frameless" | "frame" | "thumb";
  resizing?: {
    width?: number;
    height?: number;
  };
  horizontalAlignment?: "left" | "right" | "center" | "none";
  verticalAlignment?:
    | "baseline"
    | "sub"
    | "super"
    | "top"
    | "text-top"
    | "bottom"
    | "text-bottom";
  link?: string;
};

class MediaWikiFile extends MediaWikiContent {
  fileName: string;
  options?: MediaWikiFileOptions;

  constructor(fileName: string, options?: MediaWikiFileOptions) {
    super();
    this.fileName = fileName;
    this.options = options;
  }

  build() {
    let options = "";
    const { format, resizing, horizontalAlignment, verticalAlignment, link } =
      this.options;
    if (format) {
      options += `|${format}`;
    }
    if (resizing?.width && resizing?.height) {
      options += `|${resizing.width}x${resizing.height}px`;
    } else if (resizing?.width) {
      options += `|${resizing.width}px`;
    } else if (resizing?.height) {
      options += `|${resizing.height}px`;
    }
    if (horizontalAlignment) {
      options += `|${horizontalAlignment}`;
    }
    if (verticalAlignment) {
      options += `|${verticalAlignment}`;
    }
    if (link) {
      options += `|link=${link}`;
    }
    return `[[File:${this.fileName}${options}]]`;
  }
}

export default MediaWikiFile;
