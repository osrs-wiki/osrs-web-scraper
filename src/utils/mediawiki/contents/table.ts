import MediaWikiContent from "../content";

export type MediaWikiTableRow = MediaWikiContent[][];

export type MediaWikiTableOptions = {
  caption?: string;
  center?: boolean;
  headers?: string[];
};

class MediaWikiTable extends MediaWikiContent {
  options?: MediaWikiTableOptions;
  rows: MediaWikiTableRow[];

  constructor(rows: MediaWikiTableRow[], options?: MediaWikiTableOptions) {
    super();
    this.rows = rows;
    this.options = options;
  }

  build() {
    return `{| class="wikitable"${
      this.options.center ? ' style="text-align: center;"' : ""
    }\n${this.options.caption ? `|+${this.options.caption}\n` : ""}${
      this.options.headers
        ? `|-\n` + this.options.headers.map((header) => `!${header}\n`).join("")
        : ""
    }${this.rows
      .map(
        (row) =>
          `|-\n` +
          row
            .map(
              (columns) =>
                `|` + columns.map((column) => column.build()).join("") + "\n"
            )
            .join("")
      )
      .join("")}|}`;
  }
}

export default MediaWikiTable;
