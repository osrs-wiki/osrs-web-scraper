import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiTemplate,
  PollNoticeTemplate,
  PollWrapperTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { format, isBefore, parse } from "date-fns";
import { HTMLElement } from "node-html-parser";

import { formatPollNoticeDate, getPollEndDate, getPollId } from "./polls.utils";
import { PollSection } from "./types";

const pollHeader: PollSection = {
  format: async (htmlElement, url) => {
    const title = htmlElement.querySelector("h1, h2")?.textContent;
    if (!title) {
      throw new Error("Could not find poll title");
    }

    const pollView = htmlElement.getAttribute("data-testid") === "PollView";
    let description: string;
    if (pollView) {
      const descriptionNodes: HTMLElement[] = [];
      for (const child of htmlElement.childNodes) {
        if (!(child instanceof HTMLElement)) {
          continue;
        }
        if (child.id === "poll-questions") {
          break;
        }
        descriptionNodes.push(...child.querySelectorAll("p"));
      }
      description = descriptionNodes
        .map((node) => node.textContent.trim())
        .filter(Boolean)
        .join("\n\n");
    } else {
      description = htmlElement.childNodes
        .filter(
          (node) =>
            !(node instanceof HTMLElement) ||
            (node instanceof HTMLElement && node.tagName === "div")
        )
        .reduce((value, element) => value + element.textContent, "");
    }

    const voteDateNodes = htmlElement.querySelectorAll("time[datetime]");
    const startDate =
      voteDateNodes.length > 0
        ? voteDateNodes[0].textContent
        : title.match(/\(([^)]+)\)/)?.[1];
    const endDate =
      voteDateNodes.length > 1
        ? new Date(voteDateNodes[1].getAttribute("datetime"))
        : getPollEndDate(description);
    const totalElement = pollView
      ? htmlElement.querySelector("h3")
      : htmlElement.querySelector("div");
    const total = totalElement?.textContent
      .replace("Total Votes:", "")
      .replaceAll(",", "")
      .match(/\d+/)?.[0];

    if (!startDate || !endDate || isNaN(endDate.getTime())) {
      throw new Error("Could not find poll dates");
    }

    const content: MediaWikiContent[] = [];

    const number = getPollId(url);
    if (!number) {
      throw new Error("Could not find poll number in URL");
    }

    content.push(
      new PollNoticeTemplate(
        parseInt(number),
        voteDateNodes.length
          ? formatPollNoticeDate(startDate)
          : format(parse(startDate, "d MMMM yyyy", new Date()), "d MMMM yyyy"),
        voteDateNodes.length > 1
          ? formatPollNoticeDate(voteDateNodes[1].textContent)
          : format(endDate, "d MMMM yyyy")
      ).build()
    );
    content.push(new MediaWikiBreak());
    content.push(new MediaWikiBreak());

    content.push(new PollWrapperTemplate("top").build());

    const descriptionTemplate = new MediaWikiTemplate("PollDescription");
    descriptionTemplate.add("", description.trim());
    content.push(descriptionTemplate);

    content.push(new MediaWikiBreak());

    const totalTemplate = new MediaWikiTemplate("PollTotal");
    totalTemplate.add("", isBefore(new Date(), endDate) ? "" : total ?? "");
    content.push(totalTemplate);

    return content;
  },
};

export default pollHeader;
