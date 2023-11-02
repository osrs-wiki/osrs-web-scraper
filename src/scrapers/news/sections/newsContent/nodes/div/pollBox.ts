import { HTMLElement } from "node-html-parser";

import {
  LetterTemplate,
  NewsPollTemplate,
} from "../../../../../../utils/mediawiki";
import { formatText } from "../../../../../../utils/text";
import { ContentNodeParser } from "../../types";
import nodeParser from "../parser";

export const pollBoxParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const divElement = node as HTMLElement;
    const pollNodes = divElement.childNodes.filter(
      (childNode) =>
        (childNode instanceof HTMLElement &&
          (childNode as HTMLElement).rawTagName === "p") ||
        (childNode as HTMLElement).rawTagName === "b"
    );
    const letterNodes = divElement.childNodes.filter(
      (childNode) =>
        (childNode instanceof HTMLElement &&
          (childNode as HTMLElement).rawTagName === "p") ||
        (childNode as HTMLElement).rawTagName === "i"
    );
    if (pollNodes?.length > 0) {
      let parsedNumber;
      let question = "";
      if (pollNodes?.length > 1) {
        const number = pollNodes?.[0]?.textContent?.replaceAll(/[^0-9]+/g, "");
        parsedNumber = parseInt(number ? number : "1");
        question = formatText(pollNodes?.[1]?.textContent);
      } else {
        question = formatText(pollNodes?.[0]?.textContent);
      }
      return new NewsPollTemplate(question, parsedNumber).build();
    } else if (letterNodes?.length > 0) {
      const letter = nodeParser(letterNodes?.[0]);
      return new LetterTemplate(letter).build();
    }
  }
};

export default pollBoxParser;
