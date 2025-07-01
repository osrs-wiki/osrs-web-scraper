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
    const tbody = table.querySelector("tbody");
    const rowNodes = tbody.querySelectorAll("tr");
    const headerNodes = thead?.querySelectorAll("tr") ?? [];
    const headerRowNodes = (headerNodes?.length > 0 ? headerNodes : rowNodes)
      .shift()
      .querySelectorAll("td, th");
    const headers: MediaWikiTableCell[] =
      headerRowNodes.map<MediaWikiTableCell>((node) => ({
        content: [new MediaWikiText(node.textContent.trim())],
      }));
    const tableRows: MediaWikiTableRow[] = rowNodes.map<MediaWikiTableRow>(
      (trNode) => {
        const tdNodes = trNode.querySelectorAll("td");
        return {
          cells: tdNodes.map<MediaWikiTableCell>((tdNode) => ({
            content: tdNode.childNodes
              .map((childNode) => {
                if (childNode instanceof HTMLElement) {
                  return nodeParser(childNode, options);
                }
                return textParser(childNode, options);
              })
              .flat(),
          })),
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
            header: true,
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
