import { HTMLElement } from "node-html-parser";

import { NewsPollTemplate } from "../../../../../../utils/mediawiki";
import { formatText } from "../../../../../../utils/text";
import { ContentNodeParser } from "../../types";

export const pollBoxParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const divElement = node as HTMLElement;
    const childNodes = divElement.childNodes.filter(
      (childNode) =>
        childNode instanceof HTMLElement &&
        (childNode as HTMLElement).rawTagName === "p"
    );
    const number = parseInt(
      childNodes?.[0].textContent.replaceAll("Question ", "")
    );
    const question = formatText(childNodes?.[1].textContent);
    return new NewsPollTemplate(number, question).build();
  }
};

export default pollBoxParser;
