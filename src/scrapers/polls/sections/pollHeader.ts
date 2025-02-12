import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiTemplate,
  PollNoticeTemplate,
  PollWrapperTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { format, isBefore } from "date-fns";
import { HTMLElement } from "node-html-parser";

import { getPollEndDate } from "./polls.utils";
import { PollSection } from "./types";

const pollHeader: PollSection = {
  format: async (htmlElement, url) => {
    const title = htmlElement.querySelector("h2").textContent;
    const descriptionNodes = htmlElement.childNodes.filter(
      (node) =>
        !(node instanceof HTMLElement) ||
        (node instanceof HTMLElement && node.tagName === "div")
    );
    const description = descriptionNodes.reduce(
      (value, element) => value + element.textContent,
      ""
    );
    const total = htmlElement
      .querySelector("div")
      .textContent.match(/(\d)+/g)?.[0];

    const content: MediaWikiContent[] = [];

    const position = url.lastIndexOf("=");
    const number = url.substring(position + 1, url.length);
    const startDate = title
      .match(/\(([^)]+)\)/g)?.[0]
      .replaceAll(/(\()*(\))*/g, "");

    const endDate = getPollEndDate(description);

    content.push(
      new PollNoticeTemplate(
        parseInt(number),
        format(new Date(startDate), "d MMMM yyyy"),
        format(endDate ?? new Date(), "d MMMM yyyy")
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
    totalTemplate.add("", isBefore(new Date(), endDate) ? "" : total);
    content.push(totalTemplate);

    return content;
  },
};

export default pollHeader;
