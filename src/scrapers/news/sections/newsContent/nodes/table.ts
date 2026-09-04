import {
  MediaWikiBreak,
  MediaWikiHTML,
  MediaWikiTable,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";
import type {
  MediaWikiTableCell,
  MediaWikiTableCellOptions,
  MediaWikiTableRow,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { extractBackgroundColor } from "../../../../../utils/css";
import { trimContentEdges } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

const buildCellContent = (
  cellNode: HTMLElement,
  options?: { [key: string]: string | boolean | number }
) => {
  const content = cellNode.childNodes
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, options);
      }
      return textParser(childNode, options);
    })
    .flat()
    .filter((content) => content != null);

  trimContentEdges(content);

  // Ensure we always have at least some content, even if it's empty
  return content.length > 0 ? content : [new MediaWikiText("")];
};

const buildCellOptions = (
  cellNode: HTMLElement,
  isHeader: boolean
): MediaWikiTableCellOptions | undefined => {
  const options: MediaWikiTableCellOptions = {};

  if (isHeader) {
    options.header = true;
  }

  const colspan = parseInt(cellNode.attributes.colspan, 10);
  if (colspan > 1) {
    options.colspan = colspan;
  }

  const rowspan = parseInt(cellNode.attributes.rowspan, 10);
  if (rowspan > 1) {
    options.rowspan = rowspan;
  }

  const backgroundColor = extractBackgroundColor(cellNode.attributes.style);
  if (backgroundColor) {
    options.style = `background-color:${backgroundColor};color:#000000`;
  }

  return Object.keys(options).length > 0 ? options : undefined;
};

// Rows produced by empty `<tr></tr>` markup have no cells and should be discarded
const hasCells = (trNode: HTMLElement) =>
  trNode.querySelectorAll("td, th").length > 0;

export const tableParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const table = node as HTMLElement;
    const thead = table.querySelector("thead");

    // Get all tbody elements and all their tr elements
    const tbodyElements = table.querySelectorAll("tbody");
    const allRowNodes: HTMLElement[] = [];
    tbodyElements.forEach((tbody) => {
      const rows = tbody.querySelectorAll("tr").filter(hasCells);
      allRowNodes.push(...rows);
    });

    const headerNodes = (thead?.querySelectorAll("tr") ?? []).filter(hasCells);
    const headerRowArray =
      headerNodes?.length > 0 ? Array.from(headerNodes) : allRowNodes;
    const firstHeaderRow = headerRowArray.shift();
    const headerRowNodes = firstHeaderRow
      ? firstHeaderRow.querySelectorAll("td, th")
      : [];
    const headers: MediaWikiTableCell[] =
      headerRowNodes.map<MediaWikiTableCell>((node) => ({
        content: buildCellContent(node, options),
        options: buildCellOptions(node, true),
      }));
    const tableRows: MediaWikiTableRow[] = allRowNodes.map<MediaWikiTableRow>(
      (trNode) => {
        // Query for both td and th elements
        const cellNodes = trNode.querySelectorAll("td, th");
        return {
          cells: Array.from(cellNodes).map<MediaWikiTableCell>((cellNode) => {
            // Ensure we always have at least some content, even if it's empty
            const isHeader = cellNode.tagName.toLowerCase() === "th";
            return {
              content: buildCellContent(cellNode, options),
              options: buildCellOptions(cellNode, isHeader),
            };
          }),
        };
      }
    );

    return [
      new MediaWikiHTML(
        "center",
        [
          new MediaWikiTable({
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
        ],
        {},
        { collapsed: false }
      ),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
    ];
  }
};

export default tableParser;
