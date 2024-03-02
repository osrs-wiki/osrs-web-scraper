import { MediaWikiTable, MediaWikiText } from "@osrs-wiki/mediawiki-builder";
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
    const tbody = table.querySelector("tbody");
    const rowNodes = tbody.querySelectorAll("tr");
    const headerRowNodes = rowNodes.shift().querySelectorAll("td");
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

    return new MediaWikiTable({
      options: {
        style: "text-align: center;",
        class: "wikitable",
      },
      rows: [
        {
          header: true,
          cells: headers,
        },
        ...tableRows,
      ],
    });
  }
};

export default tableParser;
