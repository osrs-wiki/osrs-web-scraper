import {
  MediaWikiBreak,
  MediaWikiTable,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";
import type {
  MediaWikiTableCell,
  MediaWikiTableRow,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { ContentNodeParser } from "../types";

// Extended MediaWikiTableCell to support per-cell header flag
interface ExtendedMediaWikiTableCell extends MediaWikiTableCell {
  isHeader?: boolean;
}

// Extended MediaWikiTableRow to support extended cells
interface ExtendedMediaWikiTableRow extends Omit<MediaWikiTableRow, 'cells'> {
  cells: ExtendedMediaWikiTableCell[];
}

// Custom MediaWikiTable that supports per-cell header flags
class ExtendedMediaWikiTable extends MediaWikiTable {
  build() {
    // Format table options
    let tableOptions = "";
    if (this.options) {
      const optionPairs: string[] = [];
      if (this.options.class) optionPairs.push(`class="${this.options.class}"`);
      if (this.options.style) optionPairs.push(`style="${this.options.style}"`);
      if (optionPairs.length > 0) {
        tableOptions = " " + optionPairs.join(" ");
      }
    }
    
    const caption = this.caption ? `|+${this.caption}\n` : "";
    
    const rowsContent = this.rows
      .map((row: ExtendedMediaWikiTableRow) => {
        // Format row options
        let rowOptions = "";
        if (row.options) {
          const optionPairs: string[] = [];
          if (row.options.class) optionPairs.push(`class="${row.options.class}"`);
          if (row.options.style) optionPairs.push(`style="${row.options.style}"`);
          if (optionPairs.length > 0) {
            rowOptions = " " + optionPairs.join(" ");
          }
        }
        
        const rowPrefix = `|-${rowOptions}\n`;
        
        const cellsContent = row.cells
          .map((cell: ExtendedMediaWikiTableCell, cellIndex: number) => {
            // Determine if this cell should be a header
            // Check cell-level flag first, then fall back to row-level flag
            const isHeader = cell.isHeader !== undefined ? cell.isHeader : row.header;
            const cellMarker = isHeader ? "!" : "|";
            
            // Handle minimal mode (inline cells with || or !!)
            const marker = row.minimal && cellIndex > 0 ? cellMarker.repeat(2) : cellMarker;
            
            // Format cell options
            let cellOptions = "";
            if (cell.options) {
              const optionPairs: string[] = [];
              if (cell.options.class) optionPairs.push(`class="${cell.options.class}"`);
              if (cell.options.colspan) optionPairs.push(`colspan="${cell.options.colspan}"`);
              if (cell.options.rowspan) optionPairs.push(`rowspan="${cell.options.rowspan}"`);
              if (cell.options.style) optionPairs.push(`style="${cell.options.style}"`);
              if (optionPairs.length > 0) {
                cellOptions = optionPairs.join(" ") + " | ";
              }
            }
            
            const content = cell.content.map((c) => c.build()).join("");
            const ending = row.minimal ? "" : "\n";
            
            return `${marker} ${cellOptions}${content}${ending}`;
          })
          .join(row.minimal ? " " : "");
        
        return rowPrefix + cellsContent + (row.minimal ? "\n" : "");
      })
      .join("");
    
    return `{|${tableOptions}\n${caption}${rowsContent}|}`;
  }
}

export const tableParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const table = node as HTMLElement;
    const thead = table.querySelector("thead");
    
    // Get all tbody elements and all their tr elements
    const tbodyElements = table.querySelectorAll("tbody");
    const allRowNodes: HTMLElement[] = [];
    tbodyElements.forEach((tbody) => {
      const rows = tbody.querySelectorAll("tr");
      allRowNodes.push(...rows);
    });
    
    const headerNodes = thead?.querySelectorAll("tr") ?? [];
    const headerRowArray = headerNodes?.length > 0 ? Array.from(headerNodes) : allRowNodes;
    const firstHeaderRow = headerRowArray.shift();
    const headerRowNodes = firstHeaderRow ? firstHeaderRow.querySelectorAll("td, th") : [];
    const headers: ExtendedMediaWikiTableCell[] =
      headerRowNodes.map<ExtendedMediaWikiTableCell>((node) => ({
        content: [new MediaWikiText(node.textContent.trim())],
        isHeader: true, // Header row cells are always headers
      }));
    const tableRows: ExtendedMediaWikiTableRow[] = allRowNodes.map<ExtendedMediaWikiTableRow>(
      (trNode) => {
        // Query for both td and th elements
        const cellNodes = trNode.querySelectorAll("td, th");
        return {
          cells: Array.from(cellNodes).map<ExtendedMediaWikiTableCell>((cellNode) => {
            const content = cellNode.childNodes
              .map((childNode) => {
                if (childNode instanceof HTMLElement) {
                  return nodeParser(childNode, options);
                }
                return textParser(childNode, options);
              })
              .flat()
              .filter((content) => content != null);

            // Ensure we always have at least some content, even if it's empty
            return {
              content: content.length > 0 ? content : [new MediaWikiText("")],
              isHeader: cellNode.tagName.toLowerCase() === "th", // Mark as header if it's a <th> tag
            };
          }),
        };
      }
    );

    return [
      new ExtendedMediaWikiTable({
        options: {
          class: "wikitable",
          style: "text-align: center;",
        },
        rows: [
          {
            cells: headers,
          },
          ...tableRows,
        ],
      }),
      new MediaWikiBreak(),
    ];
  }
};

export default tableParser;
