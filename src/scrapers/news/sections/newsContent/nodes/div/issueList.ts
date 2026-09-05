import {
  MediaWikiBreak,
  MediaWikiHTML,
  MediaWikiTable,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";
import type {
  MediaWikiTableCell,
  MediaWikiTableRow,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { extractBackgroundColor } from "../../../../../../utils/css";
import { formatUtcAttributeTimestamp } from "../../../../../../utils/datetime";
import {
  escapeTablePipe,
  trimAroundBreaks,
  trimContentEdges,
} from "../../../../../../utils/mediawiki";
import { formatText } from "../../../../../../utils/text";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";
import textParser from "../text";

const headerNames = ["Title", "Status", "Raised", "Updated", "Description"];

const buildUtcTimestamp = (
  element: HTMLElement | null
): MediaWikiText | undefined => {
  const formatted = formatUtcAttributeTimestamp(
    element?.getAttribute("data-utc")
  );
  return formatted ? new MediaWikiText(formatted) : undefined;
};

const buildDescriptionContent = (
  descriptionElement: HTMLElement | null,
  options?: { [key: string]: string | boolean | number }
) => {
  const content = (descriptionElement?.childNodes ?? [])
    .map((childNode) => {
      if (childNode instanceof HTMLElement) {
        return nodeParser(childNode, options);
      }
      return textParser(childNode, options);
    })
    .flat()
    .filter((content) => content != null);

  trimContentEdges(content);
  trimAroundBreaks(content);

  return content.length > 0 ? content : [new MediaWikiText("")];
};

export const issueListParser: ContentNodeParser = (node, options) => {
  if (!(node instanceof HTMLElement)) {
    return undefined;
  }

  const issues = node.querySelectorAll(".issue");
  if (issues.length === 0) {
    return undefined;
  }

  const headers: MediaWikiTableCell[] = headerNames.map((name) => ({
    content: [new MediaWikiText(name)],
    options: { header: true },
  }));

  const rows: MediaWikiTableRow[] = issues.map((issue) => {
    const title = escapeTablePipe(
      formatText(issue.querySelector(".issue-title")?.textContent)?.trim()
    );
    const statusElement = issue.querySelector(".issue-status");
    const status = escapeTablePipe(
      formatText(statusElement?.textContent)?.trim()
    );
    const statusColor = extractBackgroundColor(statusElement?.attributes.style);

    const raised = buildUtcTimestamp(issue.querySelector(".issue-time-toggle"));
    const updated = buildUtcTimestamp(
      issue.querySelector(".issue-meta-updated")
    );
    const description = buildDescriptionContent(
      issue.querySelector(".issue-description"),
      options
    );

    return {
      cells: [
        { content: [new MediaWikiText(title ?? "")] },
        {
          content: [new MediaWikiText(status ?? "")],
          options: statusColor
            ? { style: `background-color:${statusColor};color:#000000` }
            : undefined,
        },
        { content: raised ? [raised] : [new MediaWikiText("")] },
        { content: updated ? [updated] : [new MediaWikiText("")] },
        { content: description },
      ],
    };
  });

  const table = new MediaWikiTable({
    options: { class: "wikitable" },
    rows: [{ cells: headers }, ...rows],
  });

  return [
    new MediaWikiHTML("center", [table], {}, { collapsed: false }),
    new MediaWikiBreak(),
  ];
};

export default issueListParser;
