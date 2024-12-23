import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiTemplate,
  PollNoticeTemplate,
  PollWrapperTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { format, isBefore, parse } from "date-fns";
import { HTMLElement } from "node-html-parser";

import { PollSection } from "./types";

const END_DATE_FORMATS = ["EEEE, MMMM do", "EEEE MMMM do", "EEEE do MMMM"];

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

    const endDate = description.match(
      /This poll (will close on|closes) (.*)\./
    )?.[2];
    let endDateFormatted;
    let endDateFormatIndex = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore It is a valid type
    while (!endDateFormatted || isNaN(endDateFormatted)) {
      endDateFormatted = parse(
        endDate,
        END_DATE_FORMATS[endDateFormatIndex++],
        new Date()
      );
    }

    content.push(
      new PollNoticeTemplate(
        parseInt(number),
        format(new Date(startDate), "d MMMM yyyy"),
        format(endDateFormatted ?? new Date(), "d MMMM yyyy")
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
    totalTemplate.add("", isBefore(new Date(), endDateFormatted) ? "" : total);
    content.push(totalTemplate);

    return content;
  },
};

export default pollHeader;
