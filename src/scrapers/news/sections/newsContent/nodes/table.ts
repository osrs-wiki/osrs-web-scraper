import { HTMLElement } from "node-html-parser";

import nodeParser from "./parser";
import textParser from "./text";
import { MediaWikiTable } from "../../../../../utils/mediawiki";
import { ContentNodeParser } from "../types";

export const tableParser: ContentNodeParser = (node, options) => {
  if (node instanceof HTMLElement) {
    const table = node as HTMLElement;
    const tbody = table.querySelector("tbody");
    const rowNodes = tbody.querySelectorAll("tr");
    const headerRowNodes = rowNodes.shift().querySelectorAll("td");
    const headers: string[] = headerRowNodes.map((node) =>
      node.textContent.trim()
    );
    const tableRows = rowNodes.map((trNode) => {
      const tdNodes = trNode.querySelectorAll("td");
      return tdNodes.map((tdNode) =>
        tdNode.childNodes
          .map((childNode) => {
            if (childNode instanceof HTMLElement) {
              return nodeParser(childNode, options);
            }
            return textParser(childNode, options);
          })
          .flat()
      );
    });
    return new MediaWikiTable(tableRows, {
      center: options.center as boolean,
      headers,
    });
  }
};

export default tableParser;
