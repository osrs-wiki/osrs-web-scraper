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
    const headers: MediaWikiTableCell[] =
      headerRowNodes.map<MediaWikiTableCell>((node) => ({
        content: [new MediaWikiText(node.textContent.trim())],
        options: { header: true },
      }));
    const tableRows: MediaWikiTableRow[] = allRowNodes.map<MediaWikiTableRow>(
      (trNode) => {
        // Query for both td and th elements
        const cellNodes = trNode.querySelectorAll("td, th");
        return {
          cells: Array.from(cellNodes).map<MediaWikiTableCell>((cellNode) => {
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
            const isHeader = cellNode.tagName.toLowerCase() === "th";
            return {
              content: content.length > 0 ? content : [new MediaWikiText("")],
              options: isHeader ? { header: true } : undefined,
            };
          }),
        };
      }
    );

    return [
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
      new MediaWikiBreak(),
    ];
  }
};

export default tableParser;
