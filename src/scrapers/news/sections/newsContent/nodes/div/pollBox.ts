import {
  LetterTemplate,
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
    const childNodes = divElement.childNodes.filter(
      (childNode) =>
        childNode instanceof HTMLElement &&
        ["p", "b", "i"].includes(
          (childNode as HTMLElement).rawTagName.toLocaleLowerCase()
        )
    );

    // Check if it's a poll question by looking at the actual child nodes
    const isPollQuestion = childNodes.some((child) =>
      child.textContent?.match(/Question\s*#?[\dX]+\s*:?/i)
    );

    if (isPollQuestion) {
      let parsedNumber;
      let question = "";
      if (childNodes?.length > 1) {
        const numberText = childNodes?.[0]?.textContent || "";
        const number = numberText.replaceAll(/[^0-9]+/g, "");
        // Handle "Question #X:" case by defaulting to 1
        parsedNumber = number ? parseInt(number) : 1;
        question = formatText(childNodes?.[1]?.textContent);
      } else {
        // Handle case where question number and text are in the same node
        const fullText = formatText(childNodes?.[0]?.textContent) || "";
        const match = fullText.match(/Question\s*#?(\d+)\s*:\s*(.+)/i);
        if (match) {
          parsedNumber = parseInt(match[1]);
          question = match[2].trim();
        } else {
          // Fallback: try to extract number and clean up text
          const numberMatch = fullText.match(/Question\s*#?(\d+)/i);
          parsedNumber = numberMatch ? parseInt(numberMatch[1]) : 1;
          question = fullText.replace(/Question\s*#?\d*\s*:?\s*/i, "").trim();
        }
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
