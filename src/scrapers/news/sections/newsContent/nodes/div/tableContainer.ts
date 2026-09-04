import { MediaWikiBreak, MediaWikiTable } from "@osrs-wiki/mediawiki-builder";
import type { MediaWikiTableCell } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { ContentNodeParser } from "../../types";
import { buildTable } from "../table";

// A table-container holds one or more table-scroll-groups, each wrapping a single
// <table>. These render as one outer table with a column per scroll group, where
// each column's value is the full nested sub-table.
export const tableContainerParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const subTables = node
      .querySelectorAll(".table-scroll-group")
      .map((group) => {
        const tableNode = group.querySelector("table");
        return tableNode ? buildTable(tableNode, options) : undefined;
      })
      .filter((table): table is MediaWikiTable => table != null);

    if (subTables.length === 0) {
      return undefined;
    }

    const cells: MediaWikiTableCell[] = subTables.map((table) => ({
      content: [new MediaWikiBreak(), table],
    }));

    return [
      new MediaWikiTable({ rows: [{ cells }] }),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
    ];
  }
};

export default tableContainerParser;
