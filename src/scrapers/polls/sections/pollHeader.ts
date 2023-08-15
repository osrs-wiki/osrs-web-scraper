import { HTMLElement, parse } from "node-html-parser";

import { PollSection } from "./types";
import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiTemplate,
  PollNoticeTemplate,
  PollWrapperTemplate,
} from "../../../utils/mediawiki";

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
      .textContent.match(/(\d)*/g)?.[0];

    const content: MediaWikiContent[] = [];

    const number = url.split("=")?.[3];
    const startDate = title.match(/\(([^)]+)\)/g)?.[0];

    content.push(
      new PollNoticeTemplate(parseInt(number), startDate, "").build()
    );
    content.push(new MediaWikiBreak());
    content.push(new MediaWikiBreak());

    content.push(new PollWrapperTemplate("top").build());

    const descriptionTemplate = new MediaWikiTemplate("PollDescription");
    descriptionTemplate.add("", description.trim());
    content.push(descriptionTemplate);

    content.push(new MediaWikiBreak());
    content.push(new MediaWikiBreak());

    const totalTemplate = new MediaWikiTemplate("PollTotal");
    totalTemplate.add("", total);
    content.push(totalTemplate);

    return content;
  },
};

export default pollHeader;
