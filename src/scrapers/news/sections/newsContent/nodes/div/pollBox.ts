import {
  LetterTemplate,
  MediaWikiBreak,
  MediaWikiContent,
  NewsPollTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { trim } from "../../../../../../utils/mediawiki";
import { formatText } from "../../../../../../utils/text";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";

export const pollBoxParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const divElement = node as HTMLElement;
    const isPollQuestion = node.textContent?.includes("Question #");
    const childNodes = divElement.childNodes.filter(
      (childNode) =>
        childNode instanceof HTMLElement &&
        ["p", "b", "i"].includes(
          (childNode as HTMLElement).rawTagName.toLocaleLowerCase()
        )
    );
    if (isPollQuestion) {
      let parsedNumber;
      let question = "";
      if (childNodes?.length > 1) {
        const number = childNodes?.[0]?.textContent?.replaceAll(/[^0-9]+/g, "");
        parsedNumber = parseInt(number ? number : "1");
        question = formatText(childNodes?.[1]?.textContent);
      } else {
        question = formatText(childNodes?.[0]?.textContent);
      }
      return new NewsPollTemplate(question, parsedNumber).build();
    } else if (childNodes?.length > 0) {
      const letter = trim(
        divElement.childNodes
          .map((node) => nodeParser(node))
          .flat()
          .filter((node) => node instanceof MediaWikiContent)
      );
      return new LetterTemplate(letter).build();
    }
  }
};

export default pollBoxParser;
